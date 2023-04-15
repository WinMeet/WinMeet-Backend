import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from './user.service';
import axios from 'axios';

const CLIENT_ID = 'admin-cli';
const CLIENT_SECRET = 'rVzMx62F9kMIYsM46BXdOKESIEFd5Y8f';
const KEYCLOAK_BASE_URL = 'http://localhost:8080';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  // registers user to keycloak used by register method
  async registerToKeycloak(authorization: string, userData: CreateUserDto) {
    const headers = { Authorization: `Bearer ${authorization}` };
    const data = {
      enabled: true,
      username: userData.userEmail,
      email: userData.userEmail,
      firstName: userData.userName,
      lastName: userData.userSurname,
      credentials: [
        {
          type: 'password',
          value: userData.userPassword,
          temporary: false,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${KEYCLOAK_BASE_URL}/admin/realms/test/users`,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching Keycloak access token');
    }
  }

  // gets the access token for client from keycloak
  async getKeycloakAccessToken(
    clientId: string,
    clientSecret: string,
    grantType: string,
  ) {
    const data = new URLSearchParams([
      ['client_id', clientId],
      ['client_secret', clientSecret],
      ['grant_type', grantType],
    ]);

    try {
      const response = await axios.post(
        `${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching Keycloak access token');
    }
  }

  @Post('login')
  async login(@Res() response, @Body() userData: any) {
    const url = `${KEYCLOAK_BASE_URL}/realms/test/protocol/openid-connect/token`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const data = new URLSearchParams([
      ['grant_type', 'password'],
      ['client_id', CLIENT_ID],
      ['client_secret', CLIENT_SECRET],
      ['username', userData.email],
      ['password', userData.password],
    ]);

    try {
      const res = await axios.post(url, data, { headers });
      return response.status(HttpStatus.OK).json({
        token: res.data['access_token'],
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.UNAUTHORIZED).json({
        error: error.response.data.error_description,
      });
    }
  }

  @Post('register')
  async register(@Res() response, @Body() userData: CreateUserDto) {
    try {
      const keycloakAccessToken = await this.getKeycloakAccessToken(
        CLIENT_ID,
        CLIENT_SECRET,
        'client_credentials',
      );
      await this.registerToKeycloak(keycloakAccessToken.access_token, userData);

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        error: err.message,
      });
    }
  }
}
