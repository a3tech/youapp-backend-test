import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {}

    async create(data: Partial<User>): Promise<User> {
        return this.userModel.create(data);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username });
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id);
    }
}
