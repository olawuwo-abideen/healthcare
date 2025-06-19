import { Controller, Get, Param, Query } from '@nestjs/common';
import { User } from '../../shared/entities/user.entity';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { TransactionService } from './transaction.service';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { Transaction } from '../../shared/entities/transaction.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

    @Get()
  async getTransactions(
    @CurrentUser() user: User,
    @Query() pagination: PaginationDto) {
    return this.transactionService.getTransactions(user, pagination);
  }

  @Get('/:id')
  public async getTransaction(
    @CurrentUser() user: User,
    @Param('id', IsValidUUIDPipe) id: string,
  ): Promise<Transaction> {
    return await this.transactionService.getTransaction(user, id);
  }
  
}
