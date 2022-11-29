export default pubsub => ({
  Query: {
    Stub: () => {
      return { isElevated: false };
    },
  },
});
