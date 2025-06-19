import {
BadRequestException,
Injectable,
NotFoundException,
UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../../shared/entities/user.entity';
import {
Transaction,
} from '../../shared/entities/transaction.entity';
import { EntityManager, Repository } from 'typeorm';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

@Injectable()
export class TransactionService {
constructor(
@InjectEntityManager() private readonly entityManager: EntityManager,
@InjectRepository(Transaction)
private readonly transactionRepository: Repository<Transaction>,
) {}


public async getTransactions(
user: User,
pagination: PaginationDto,
) {

const page = pagination.page || 1;
const pageSize = pagination.pageSize || 10;
const skip = (page - 1) * pageSize;

const where: Record<string, any> = {
user: { id: user.id }
};


const [transactions, totalTransactions] =
await this.transactionRepository.findAndCount({
where,
skip,
take: pageSize,
});

const totalPage = Math.ceil(totalTransactions / pageSize);
const currentPage = skip / pageSize + 1;

return { totalTransactions, totalPage, currentPage, transactions };
}

public async getTransaction(
user: User,
transactionId: string,
): Promise<Transaction> {
const transaction = await this.transactionRepository.findOne({
where: { id: transactionId, userId: user.id },
});

if (!transaction) {
throw new NotFoundException(`Transaction not found`);
}

return transaction;
}

}
