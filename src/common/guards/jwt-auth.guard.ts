import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {Request} from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
 
    async canActivate(context: ExecutionContext): Promise<boolean> { //canActive : should we allow this request to proceed or not ?
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);


        if(!token) {
            throw new UnauthorizedException('Token Not Found!')
        }

        try{
            const payload = await this.jwtService.verifyAsync(token);

            request['user'] = payload;
        }catch {
            throw new UnauthorizedException('Token invalid Or expired')
        }
        return true;
    }


    private extractTokenFromHeader(request: Request):string|undefined{
        const [type,token] = request.headers.authorization?.split(' ') ?? []; 
        //ex:Authorization: Bearer eyJhbGciOiJIUzI1Ni...
        //split(' ') ==> "Bearer eyJhbGciOiJIUzI1Ni..." To ["Bearer","eyJhbGciOiJIUzI1Ni..."]
        return type === 'Bearer' ? token: undefined;
    }
}
/*
    Client
  │
  │ Authorization: Bearer JWT
  ▼
AuthGuard
  │
  ├── extractTokenFromHeader()
  │       │
  │       └── استخراج JWT
  │
  ├── Token موجود؟
  │       ├── ❌ → 401
  │       └── ✅
  │
  ├── verifyAsync(token)
  │       │
  │       ├── ❌ Invalid/Expired → 401
  │       │
  │       └── ✅ payload
  │
  ├── request.user = payload
  │
  └── return true
           │
           ▼
       Controller
*/ 