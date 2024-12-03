import { StatusUser, userTypes } from "../../../type";

export interface SimpleUserPrismaDto {
    auth: {
        email: string;
    }[];
    user_id: string;
    name: string;
    nick_name: string;
    status: StatusUser;
    type: userTypes;
    birth_date: Date | null;
}