const schema = `
  type Query {
    # Заглушка
    Stub: Stub
  }
  type Stub {
    isElevated: Boolean!
  }
  `;
export default { schema };
