import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database.config';

export class MigrationRunner {
  private sequelize: Sequelize;

  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const config = (databaseConfig as any)[env];

    this.sequelize = new Sequelize({
      ...config,
      logging: false,
    });
  }

  async runMigrations(): Promise<void> {
    try {
      console.log('Running database migrations...');

      // Import and run migrations manually
      const { Umzug, SequelizeStorage } = require('umzug');

      const umzug = new Umzug({
        migrations: {
          glob: 'src/database/migrations/*.js',
          resolve: ({
            name,
            path,
            context,
          }: {
            name: string;
            path: string;
            context: any;
          }) => {
            const migration = require(path);
            return {
              name,
              up: async () =>
                migration.up(context.queryInterface, context.sequelize),
              down: async () =>
                migration.down(context.queryInterface, context.sequelize),
            };
          },
        },
        context: {
          queryInterface: this.sequelize.getQueryInterface(),
          sequelize: this.sequelize,
        },
        storage: new SequelizeStorage({ sequelize: this.sequelize }),
        logger: console,
      });

      await umzug.up();
      console.log('Migrations completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      await this.sequelize.close();
    }
  }

  async runSeeders(): Promise<void> {
    try {
      console.log('Running database seeders...');

      // Import and run seeders manually
      const { Umzug, SequelizeStorage } = require('umzug');

      const umzug = new Umzug({
        migrations: {
          glob: 'src/database/seeders/*.js',
          resolve: ({
            name,
            path,
            context,
          }: {
            name: string;
            path: string;
            context: any;
          }) => {
            const seeder = require(path);
            return {
              name,
              up: async () =>
                seeder.up(context.queryInterface, context.sequelize),
              down: async () =>
                seeder.down(context.queryInterface, context.sequelize),
            };
          },
        },
        context: {
          queryInterface: this.sequelize.getQueryInterface(),
          sequelize: this.sequelize,
        },
        storage: new SequelizeStorage({
          sequelize: this.sequelize,
          modelName: 'SequelizeData',
        }),
        logger: console,
      });

      await umzug.up();
      console.log('Seeders completed successfully!');
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    } finally {
      await this.sequelize.close();
    }
  }
}
