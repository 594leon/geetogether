import jwt from 'jsonwebtoken';
import { Account } from '../models/account.model';

const signJWT = (jwtKey: string, account: Account) => {
    //創建jwt
    const userJwtoken = jwt.sign({
        id: account.id,
        email: account.email,
        status: account.status
    }, jwtKey,
        { expiresIn: 24 * 60 * 60 * 1000 });//expiresIn 選項可以指定簽發的 JWT 多久到期，目前設定1天

    return userJwtoken;
}

export { signJWT };