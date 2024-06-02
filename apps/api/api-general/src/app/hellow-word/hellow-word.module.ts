import { Module } from '@nestjs/common';
import { HellowWordController } from './hellow-word.comtroller';

@Module({
  controllers: [HellowWordController],
  providers: [],
})
export class HellowWordmodule {}
