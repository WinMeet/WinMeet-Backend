import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Put,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from './user.service';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import * as querystring from 'querystring';
import axios from 'axios';

@Controller('registeruser')
export class UserController {
  constructor(
    private eventService: UserService,
    private httpService: HttpService,
  ) { }

  async register_to_keycloak(
    @Headers('Authorization') authorization: string,
    @Body() data: any,
  ) {
    const headers = { Authorization: `Bearer ${authorization}` };
    const data_to_Send = {
      enabled: 'true',
      username: data.userName,
      email: data.userEmail,
      firstName: data.userName,
      lastName: data.userSurname,
      credentials: [
        {
          type: 'password',
          value: data.userPassword,
          temporary: 'false',
        },
      ],
      requiredActions: ['CONFIGURE_TOTP', 'VERIFY_EMAIL'],
      groups: [],
      attributes: {
        locale: ['en'],
      },
    };
    const response = await axios.post(
      'http://localhost:8080/admin/realms/test/users',
      data_to_Send,
      { headers },
    );
    console.log(response.data);
    return response.data;
  }

  async registerkeycloakuser(
    @Body('client_id') name: string,
    @Body('client_secret') secret: string,
    @Body('grant_type') grant: string,
  ) {
    const data = new URLSearchParams();
    data.append('client_id', name);
    data.append('client_secret', secret);
    data.append('grant_type', grant);
    const response = await axios.post(
      'http://localhost:8080/realms/master/protocol/openid-connect/token',
      data,
    );
    return response.data;
  }
  @Post('verify_user')
  async verify_user(@Res() response, @Body() data: any) {

    const url = 'http://localhost:8080/realms/test/protocol/openid-connect/token';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: 'KEYCLOAK_LOCALE=en',
    };

    const data_Arr = new URLSearchParams();
    data_Arr.append('grant_type', 'password');
    data_Arr.append('client_id', 'admin-cli');
    data_Arr.append('client_secret', 'rVzMx62F9kMIYsM46BXdOKESIEFd5Y8f');
    data_Arr.append('username', data.email);
    data_Arr.append('password', data.password);

    axios
      .post(url, data_Arr, { headers })
      .then((res) => {
        console.log(res.data['access_token']);
        return response.status(HttpStatus.ACCEPTED).json({
          token: res.data['access_token'],

        });
      })
      .catch((error) => {
        console.error(error);
        return response.status(HttpStatus.FORBIDDEN).json({
          token: 'unauthorized user',

        });
      });

  }
  @Post()
  async createUser(@Res() response, @Body() CreateUserDto: CreateUserDto) {
    try {
      const newEvent = await this.eventService.createUser(CreateUserDto);
      const keycloak_val = await this.registerkeycloakuser(
        'admin-cli',
        'rVzMx62F9kMIYsM46BXdOKESIEFd5Y8f',
        'client_credentials',
      );

      const register_kc = await this.register_to_keycloak(
        keycloak_val.access_token,
        newEvent,
      );

      console.log(register_kc);

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newEvent,
      });
    } catch (err) {
      // console.log(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error! User not created.',
        error: 'Bad request!',
      });
    }
  }
}
