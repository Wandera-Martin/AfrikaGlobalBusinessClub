from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer, LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from .models import User, EmailVerificationOTP

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate OTP
            otp = EmailVerificationOTP.generate_code(user)
            
            # --- DEBUG HELPER FOR DEVELOPMENT ---
            with open("OTP_DEBUG.txt", "a") as f:
                f.write(f"[{user.email}] New OTP Generated: {otp.code}\n")
            # ------------------------------------
            
            # Send Email
            send_mail(
                subject='Verify your email address',
                message=f'Your verification code is: {otp.code}\nIt expires in 3 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({
                "message": "Account created successfully. Please check your email for the verification code.",
                "email": user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response({"error": "Email and code are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp = EmailVerificationOTP.objects.get(user=user, code=code, is_used=False)
        except EmailVerificationOTP.DoesNotExist:
            return Response({"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)

        if otp.is_expired():
            return Response({"error": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used and user as verified
        otp.is_used = True
        otp.save()
        
        user.is_email_verified = True
        user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Email verified successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if user.is_email_verified:
            return Response({"error": "Email is already verified"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate new OTP (invalidates old ones)
        otp = EmailVerificationOTP.generate_code(user)
        
        # --- DEBUG HELPER FOR DEVELOPMENT ---
        with open("OTP_DEBUG.txt", "a") as f:
            f.write(f"[{user.email}] Resend OTP Generated: {otp.code}\n")
        # ------------------------------------
        
        # Send Email
        send_mail(
            subject='Your new verification code',
            message=f'Your new verification code is: {otp.code}\nIt expires in 3 minutes.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"message": "A new verification code has been sent"})


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Always return 200 even if email not found (prevents user enumeration)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If that email is registered, a reset link has been sent."})

        # Generate a signed, single-use token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Build reset URL pointing to the React frontend
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/reset-password?uid={uid}&token={token}"

        send_mail(
            subject='Reset your password – AG Business',
            message=(
                f'Hi {user.first_name},\n\n'
                f'Click the link below to reset your password. This link expires in 24 hours.\n\n'
                f'{reset_url}\n\n'
                f'If you did not request a password reset, you can safely ignore this email.\n\n'
                f'– AG Business Team'
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "If that email is registered, a reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        # Decode uid back to primary key
        try:
            user_pk = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_pk)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate the token
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reset link. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password has been reset successfully."})


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid or already blacklisted token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response(
                {"detail": "access_token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify the access token by calling Google's userinfo endpoint
        import urllib.request as urllib_req
        import json as json_lib
        try:
            req = urllib_req.Request(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            with urllib_req.urlopen(req, timeout=5) as resp:
                userinfo = json_lib.loads(resp.read().decode())
        except Exception as e:
            return Response(
                {"detail": f"Failed to verify Google token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = userinfo.get('email')
        first_name = userinfo.get('given_name', '')
        last_name = userinfo.get('family_name', '')
        email_verified = userinfo.get('email_verified', False)

        if not email or not email_verified:
            return Response(
                {"detail": "Google account email is not verified."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create the user — Google has already verified the email
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'is_email_verified': True,
                'role': 'sme',  # default role; user can change later
            }
        )

        # If user already existed but email wasn't yet verified, mark it now
        if not created and not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=['is_email_verified'])

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "created": created,  # tells frontend if this is a new signup
        })

