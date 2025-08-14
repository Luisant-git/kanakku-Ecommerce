import { ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Connection } from 'mysql2/promise';
import { MYSQL_CONNECTION } from '../database/mysql.provider';
import { CreateNanoregDto } from './dto/create-nanoreg.dto';

@Injectable()
export class NanoregService {
  constructor(@Inject(MYSQL_CONNECTION) private connection: Connection) {}

  async findAll() {
    const [rows] = await this.connection.execute('SELECT * FROM nanoreg');
    return rows;
  }

  async create(data: CreateNanoregDto) {
    const columns = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    try {
      await this.connection.execute(
        `INSERT INTO nanoreg (${columns}) VALUES (${placeholders})`,
        values
      );

      return { message: 'Nanoreg record inserted successfully' };
    } catch (error) {
      if (error.code === 'ER_TABLEACCESS_DENIED_ERROR') {
        // Permission denied
        throw new ForbiddenException(
          `Database user does not have permission to insert into nanoreg table`
        );
      }

      // Any other SQL/database error
      throw new InternalServerErrorException(
        `Failed to insert nanoreg record: ${error.message}`
      );
    }
  }
}
