const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('companies', [
        { name: 'Name1', domain: 'Domain1', created_at: new Date(), updated_at: new Date() },
        { name: 'Name2', domain: 'Domain2', created_at: new Date(), updated_at: new Date() },
        { name: 'Name3', domain: 'Domain3', created_at: new Date(), updated_at: new Date() },
        { name: 'Name4', domain: 'Domain4', created_at: new Date(), updated_at: new Date() },
        { name: 'Name5', domain: 'Domain5', created_at: new Date(), updated_at: new Date() },
        { name: 'Name6', domain: 'Domain6', created_at: new Date(), updated_at: new Date() },
        { name: 'Name7', domain: 'Domain7', created_at: new Date(), updated_at: new Date() },
        { name: 'Name8', domain: 'Domain8', created_at: new Date(), updated_at: new Date() },
        { name: 'Name9', domain: 'Domain9', created_at: new Date(), updated_at: new Date() },
        { name: 'Name10', domain: 'Domain10', created_at: new Date(), updated_at: new Date() }
      ], { transaction });
      await queryInterface.bulkInsert('projects', [
        { name: 'Project1', description: 'Description1', is_active: true, company_id: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Project2', description: 'Description2', is_active: true, company_id: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Project3', description: 'Description3', is_active: true, company_id: 2, created_at: new Date(), updated_at: new Date() },
        { name: 'Project4', description: 'Description4', is_active: true, company_id: 2, created_at: new Date(), updated_at: new Date() },
        { name: 'Project5', description: 'Description5', is_active: true, company_id: 3, created_at: new Date(), updated_at: new Date() },
        { name: 'Project6', description: 'Description6', is_active: true, company_id: 3, created_at: new Date(), updated_at: new Date() },
        { name: 'Project7', description: 'Description7', is_active: true, company_id: 4, created_at: new Date(), updated_at: new Date() },
        { name: 'Project8', description: 'Description8', is_active: true, company_id: 4, created_at: new Date(), updated_at: new Date() },
        { name: 'Project9', description: 'Description9', is_active: true, company_id: 5, created_at: new Date(), updated_at: new Date() },
        { name: 'Project10', description: 'Description10', is_active: true, company_id: 5, created_at: new Date(), updated_at: new Date() },
        { name: 'Project11', description: 'Description11', is_active: false, company_id: 6, created_at: new Date(), updated_at: new Date() },
        { name: 'Project12', description: 'Description12', is_active: false, company_id: 6, created_at: new Date(), updated_at: new Date() },
        { name: 'Project13', description: 'Description13', is_active: false, company_id: 7, created_at: new Date(), updated_at: new Date() },
        { name: 'Project14', description: 'Description14', is_active: false, company_id: 7, created_at: new Date(), updated_at: new Date() },
        { name: 'Project15', description: 'Description15', is_active: false, company_id: 8, created_at: new Date(), updated_at: new Date() },
        { name: 'Project16', description: 'Description16', is_active: false, company_id: 8, created_at: new Date(), updated_at: new Date() },
        { name: 'Project17', description: 'Description17', is_active: false, company_id: 9, created_at: new Date(), updated_at: new Date() },
        { name: 'Project18', description: 'Description18', is_active: false, company_id: 9, created_at: new Date(), updated_at: new Date() },
        { name: 'Project19', description: 'Description19', is_active: false, company_id: 10, created_at: new Date(), updated_at: new Date() },
        { name: 'Project20', description: 'Description20', is_active: false, company_id: 10, created_at: new Date(), updated_at: new Date() }
      ], { transaction });
      await queryInterface.bulkInsert('user_profiles', [
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User2', created_at: new Date(), updated_at: new Date() },
        { name: 'User3', created_at: new Date(), updated_at: new Date() },
        { name: 'User4', created_at: new Date(), updated_at: new Date() },
        { name: 'User5', created_at: new Date(), updated_at: new Date() },
        { name: 'User6', created_at: new Date(), updated_at: new Date() },
        { name: 'User7', created_at: new Date(), updated_at: new Date() },
        { name: 'User8', created_at: new Date(), updated_at: new Date() },
        { name: 'User9', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User1', created_at: new Date(), updated_at: new Date() },
        { name: 'User2', created_at: new Date(), updated_at: new Date() }
      ], { transaction });
      await queryInterface.bulkInsert('users', [
        { email: '1@email.com', is_active: true, company_id: 1, profile_id: 1, created_at: new Date(), updated_at: new Date() },
        { email: '2@email.com', is_active: true, company_id: 1, profile_id: 2, created_at: new Date(), updated_at: new Date() },
        { email: '3@email.com', is_active: true, company_id: 1, profile_id: 3, created_at: new Date(), updated_at: new Date() },
        { email: '4@email.com', is_active: true, company_id: 1, profile_id: 4, created_at: new Date(), updated_at: new Date() },
        { email: '5@email.com', is_active: true, company_id: 1, profile_id: 5, created_at: new Date(), updated_at: new Date() },
        { email: '6@email.com', is_active: true, company_id: 1, profile_id: 6, created_at: new Date(), updated_at: new Date() },
        { email: '7@email.com', is_active: false, company_id: 1, profile_id: 7, created_at: new Date(), updated_at: new Date() },
        { email: '8@email.com', is_active: false, company_id: 1, profile_id: 8, created_at: new Date(), updated_at: new Date() },
        { email: '9@email.com', is_active: false, company_id: 1, profile_id: 9, created_at: new Date(), updated_at: new Date() },
        { email: '10@email.com', is_active: true, company_id: 1, profile_id: 10, created_at: new Date(), updated_at: new Date() },
        { email: '11@email.com', is_active: true, company_id: 2, profile_id: 12, created_at: new Date(), updated_at: new Date() },
        { email: '12@email.com', is_active: true, company_id: 2, profile_id: 12, created_at: new Date(), updated_at: new Date() },
        { email: '13@email.com', is_active: true, company_id: 2, profile_id: 13, created_at: new Date(), updated_at: new Date() },
        { email: '14@email.com', is_active: true, company_id: 2, profile_id: 14, created_at: new Date(), updated_at: new Date() },
        { email: '15@email.com', is_active: true, company_id: 2, profile_id: 15, created_at: new Date(), updated_at: new Date() },
        { email: '16@email.com', is_active: true, company_id: 2, profile_id: 16, created_at: new Date(), updated_at: new Date() },
        { email: '17@email.com', is_active: false, company_id: 2, profile_id: 17, created_at: new Date(), updated_at: new Date() },
        { email: '18@email.com', is_active: false, company_id: 2, profile_id: 18, created_at: new Date(), updated_at: new Date() },
        { email: '19@email.com', is_active: false, company_id: 2, profile_id: 19, created_at: new Date(), updated_at: new Date() },
        { email: '20@email.com', is_active: false, company_id: 2, profile_id: 20, created_at: new Date(), updated_at: new Date() },
        { email: '21@email.com', is_active: false, company_id: 2, profile_id: null, created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // licenses
      await queryInterface.bulkInsert('licenses', [
        { name: 'License1', created_at: new Date(), updated_at: new Date() },
        { name: 'License2', created_at: new Date(), updated_at: new Date() },
        { name: 'License3', created_at: new Date(), updated_at: new Date() },
        { name: 'License4', created_at: new Date(), updated_at: new Date() },
        { name: 'License5', created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // user-licenses
      await queryInterface.bulkInsert('user_licenses', [
        { user_id: 1, license_id: 1, years_active: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 1, license_id: 2, years_active: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 1, license_id: 4, years_active: 7, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, license_id: 5, years_active: 1, created_at: new Date(), updated_at: new Date() },
      ], { transaction });

      // user-projects
      await queryInterface.bulkInsert('user_projects', [
        { project_id: 1, user_id: 1, review: 'User project 1 1', created_at: new Date(), updated_at: new Date() },
        { project_id: 1, user_id: 2, review: 'User project 1 2', created_at: new Date(), updated_at: new Date() },
        { project_id: 2, user_id: 2, review: 'User project 2 2', created_at: new Date(), updated_at: new Date() },
        { project_id: 3, user_id: 3, review: 'User project 3 3', created_at: new Date(), updated_at: new Date() },
      ], { transaction });
      await transaction.commit();
    }
    catch (err) {
      console.log('UP FAILED', err);
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('delete from user_projects CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from user_profiles CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from user_licenses CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from licenses CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from users CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from projects CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from devices CASCADE', { transaction, type: QueryTypes.DELETE });
      await queryInterface.sequelize.query('delete from companies CASCADE', { transaction, type: QueryTypes.DELETE });

      await queryInterface.sequelize.query('ALTER SEQUENCE users_id_seq RESTART;UPDATE users SET id = DEFAULT', { transaction, type: QueryTypes.UPDATE });
      await queryInterface.sequelize.query('ALTER SEQUENCE licenses_id_seq RESTART;UPDATE licenses SET id = DEFAULT', { transaction, type: QueryTypes.UPDATE });
      await queryInterface.sequelize.query('ALTER SEQUENCE projects_id_seq RESTART;UPDATE projects SET id = DEFAULT', { transaction, type: QueryTypes.UPDATE });
      await queryInterface.sequelize.query('ALTER SEQUENCE user_profiles_id_seq RESTART;UPDATE user_profiles SET id = DEFAULT', { transaction, type: QueryTypes.UPDATE });
      await queryInterface.sequelize.query('ALTER SEQUENCE companies_id_seq RESTART;UPDATE companies SET id = DEFAULT', { transaction, type: QueryTypes.UPDATE });
      await transaction.commit();
    }
    catch (err) {
      console.log('DOWN FAILED', err);
      await transaction.rollback();
      throw err;
    }
  }
};
