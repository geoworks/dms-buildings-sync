const schema = `
  scalar JSON
  
  type Query {
    # Получение информации о пользователе
    SessionInfo: SessionInfo
  }
  type SessionInfo {
    id: Int
    isElevated: Boolean!
    login: String!
    userName: String
    roles: [SessionRole]
    organizations: JSON
  }
  type SessionRole {
    id: Int!
    name: String!
    rules: [String]
  }
  type Subscription {
    sessionInfoChanged: SessionInfo
  }
  `;
export default { schema };
