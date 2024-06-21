"""
Django settings for metaculus_web project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

import os
from pathlib import Path

import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Current env
ENV = os.environ.get("METACULUS_ENV", "").strip()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "SECRET_KEY", "django-insecure-47@xwq5$pn*^d(2233!+41#=-)53&@iz)*t@foixp(ov2e7r)t"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Application definition

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third-party:
    "django_extensions",
    "rest_framework",
    "rest_framework.authtoken",
    "social_django",
    "rest_social_auth",
    "corsheaders",
    "anymail",
    "django_dramatiq",
    "admin_auto_filters",
    # first-party:
    "migrator",
    "utils",
    "authentication",
    "users",
    "posts",
    "questions",
    "projects",
    "scoring",
    "comments",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "utils.middlewares.middleware_alpha_access_check",
]

# Cors configuration
CORS_ORIGIN_WHITELIST = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

ROOT_URLCONF = "metaculus_web.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "metaculus_web/templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "metaculus_web.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        **dj_database_url.config(conn_max_age=600, default="postgres:///metaculus"),
    },
}

if ENV != "testing":
    # Old database for the migrator
    DATABASES["old"] = {
        **dj_database_url.config(
            env="OLD_DATABASE_URL",
            conn_max_age=600,
            default="postgres:///metaculus_old",
        ),
        # Should be readonly connection
        "OPTIONS": {"options": "-c default_transaction_read_only=on"},
    }

# TODO: probably we should switch to the explicit transactions
DATABASES["default"]["ATOMIC_REQUESTS"] = True

# REST Framework
# https://www.django-rest-framework.org/

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "EXCEPTION_HANDLER": "utils.views.custom_exception_handler",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 100,
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Auth
AUTH_USER_MODEL = "users.User"
AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "authentication.backends.AuthLoginBackend",
    "social_core.backends.facebook.FacebookOAuth2",
    "social_core.backends.google.GoogleOAuth2",
)

SOCIAL_AUTH_PIPELINE = (
    "social_core.pipeline.social_auth.social_details",
    "social_core.pipeline.social_auth.social_uid",
    "social_core.pipeline.social_auth.auth_allowed",
    "social_core.pipeline.social_auth.social_user",
    "social_core.pipeline.user.get_username",
    "social_core.pipeline.social_auth.associate_by_email",
    "social_core.pipeline.user.create_user",
    "social_core.pipeline.social_auth.associate_user",
    "social_core.pipeline.social_auth.load_extra_data",
    "social_core.pipeline.user.user_details",
)

SOCIAL_AUTH_FACEBOOK_KEY = os.environ.get("SOCIAL_AUTH_FACEBOOK_KEY")
SOCIAL_AUTH_FACEBOOK_SECRET = os.environ.get("SOCIAL_AUTH_FACEBOOK_SECRET")
SOCIAL_AUTH_FACEBOOK_SCOPE = ["email"]
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {"fields": "id, name, email"}
# Google
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")

# Email configuration
# https://anymail.dev/
ANYMAIL = {
    "MAILGUN_API_KEY": os.environ.get("MAILGUN_API_KEY"),
}
EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "accounts@metaculus.com")

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Frontend configuration
FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000")

# Redis endpoint
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")

# django-dramatiq
# https://github.com/Bogdanp/django_dramatiq
DRAMATIQ_BROKER = {
    "BROKER": "dramatiq.brokers.redis.RedisBroker",
    "OPTIONS": {
        # Setting redis db to 1 for the MQ storage
        "url": f"{REDIS_URL}/1",
    },
    "MIDDLEWARE": [
        "dramatiq.middleware.AgeLimit",
        "dramatiq.middleware.TimeLimit",
        "dramatiq.middleware.Callbacks",
        "django_dramatiq.middleware.DbConnectionsMiddleware",
        "django_dramatiq.middleware.AdminMiddleware",
    ],
}

# Restricted DEV access
# If none -> not restricted
ALPHA_ACCESS_TOKEN = os.environ.get("ALPHA_ACCESS_TOKEN")

ALLOWED_HOSTS = []
CSRF_TRUSTED_ORIGINS = [FRONTEND_BASE_URL]
