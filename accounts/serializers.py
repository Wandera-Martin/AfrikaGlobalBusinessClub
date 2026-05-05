from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from email_validator import validate_email as validate_email_standard, EmailNotValidError

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']

    def validate_email(self, value):
        try:
            # Industrial standard validation: checks syntax + DNS + deliverability
            valid = validate_email_standard(value)
            return valid.normalized
        except EmailNotValidError as e:
            raise serializers.ValidationError(str(e))

    def validate_password(self, value):
        # Enforce at least 1 uppercase letter
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        
        # Enforce at least 1 number
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
            
        # Enforce at least 1 special character
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")

        # Run Django's built-in strength validators (CommonPasswordValidator, etc.)
        try:
            validate_password(value)
        except DjangoValidationError as e:
            # Join all Django password errors into one message
            raise serializers.ValidationError(list(e.messages))
            
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        
        # Uses UserManager.create_user → hashes the password
        return User.objects.create_user(
            email=email,
            password=password,
            **validated_data
        )

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        # Reuse the same strength rules as registration
        pw = data['new_password']
        if not re.search(r'[A-Z]', pw):
            raise serializers.ValidationError({'new_password': 'Password must contain at least one uppercase letter.'})
        if not re.search(r'\d', pw):
            raise serializers.ValidationError({'new_password': 'Password must contain at least one number.'})
        if not re.search(r'[^A-Za-z0-9]', pw):
            raise serializers.ValidationError({'new_password': 'Password must contain at least one special character.'})
        try:
            validate_password(pw)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})
        return data