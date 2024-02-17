// eslint parse file

export const parser = (ast, comments) => {
    const { body } = ast.program;
    const { length } = body;
    const result = [];
    for (let i = 0; i < length; i++) {
        const node = body[i];
        if (node.type === "VariableDeclaration") {
            const { declarations } = node;
            const { length: l } = declarations;
            for (let j = 0; j < l; j++) {
                const { id, init } = declarations[j];
                if (id.type === "ObjectPattern") {
                    const { properties } = id;
                    const { length: pl } = properties;
                    for (let k = 0; k < pl; k++) {
                        const { key, value } = properties[k];
                        if (key.type === "Identifier") {
                            result.push(key.name);
                        }
                    }
                }
            }
        }
    }
    return result;
};
