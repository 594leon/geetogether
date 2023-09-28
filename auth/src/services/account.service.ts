import { AccountStatus } from "@serjin/common";
import { Account } from "../models/account.model";

export default interface AccountService {
    find: () => Promise<Account[]>;
    findById: (id: string) => Promise<Account | null>;
    findByEmail: (email: string) => Promise<Account | null>;
    insert: (email: string, password: string) => Promise<string>;
    update: (id: string, data: { email?: string, password?: string, status?: AccountStatus }) => Promise<number>;
    delete: (id: string) => Promise<number>;
}