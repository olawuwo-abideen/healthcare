import { User } from '../../../shared/entities/user.entity';

export class UserCreatedEvent {
constructor(public user: User) {}
}
