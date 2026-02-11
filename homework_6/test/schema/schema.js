const schema = {
    type: "object",
    properties: {
        userId: { type: "string" },
        username: { type: "string" },
        age: { type: "number" },
        protected: { type: "boolean" }
    },
    required: ["userId", "username", "age"]
};

export default schema;