import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('ORDERS_SERVICE') private client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) return false;

    try {
      const response = await firstValueFrom(
        this.client.send('verify-jwt', { token })
      );

      if (response.valid) {
        request.user = { userId: response.userId };
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}
