from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsBusinessProfileOwner(BasePermission):
    """
    Object-level permission: only the owner of a BusinessProfile can modify it.
    Read-only access is granted to any authenticated user.
    """
    message = "You do not have permission to modify this business profile."

    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS for any authenticated user
        if request.method in SAFE_METHODS:
            return True
        # Write access only for the profile owner
        return obj.user == request.user


class IsPostOwner(BasePermission):
    """
    Object-level permission: only the business that created a post can
    edit or delete it. Read-only access (likes, comments, shares) is
    granted to any authenticated user.
    """
    message = "You do not have permission to modify or delete this post."

    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS for any authenticated user
        if request.method in SAFE_METHODS:
            return True
        # Write/delete access only for the post owner
        return obj.business.user == request.user
