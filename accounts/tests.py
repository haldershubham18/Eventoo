from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthEndpointTests(APITestCase):
    def test_signup_creates_user_and_returns_session_payload(self):
        url = reverse('signup')
        payload = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'password': 'StrongPass123',
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data['email'], payload['email'])
        self.assertEqual(data['name'], payload['name'])
        self.assertTrue(data['token'])
        self.assertTrue(data['refresh'])

        user = get_user_model().objects.get(email=payload['email'])
        self.assertEqual(user.username, payload['email'])
        self.assertEqual(user.first_name, 'Jane')
        self.assertEqual(user.last_name, 'Doe')
        self.assertTrue(user.check_password(payload['password']))

    def test_login_returns_session_payload_for_valid_credentials(self):
        get_user_model().objects.create_user(
            username='jane@example.com',
            email='jane@example.com',
            password='StrongPass123',
            first_name='Jane',
            last_name='Doe',
        )

        response = self.client.post(
            reverse('login'),
            {'email': 'jane@example.com', 'password': 'StrongPass123'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['email'], 'jane@example.com')
        self.assertEqual(data['name'], 'Jane Doe')
        self.assertTrue(data['token'])
        self.assertTrue(data['refresh'])

    def test_login_returns_message_for_invalid_password(self):
        get_user_model().objects.create_user(
            username='jane@example.com',
            email='jane@example.com',
            password='StrongPass123',
            first_name='Jane',
            last_name='Doe',
        )

        response = self.client.post(
            reverse('login'),
            {'email': 'jane@example.com', 'password': 'wrong-password'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json()['message'], 'Incorrect email or password.')
