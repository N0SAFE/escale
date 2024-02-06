export default {
  '...#deep': {
    ['#type']: 'object',
    schema: {
      cmd: {
        ['#description']: 'command to run',
        ['#type']: 'string',
      },
      description: {
        ['#description']: 'description of the command',
        ['#type']: 'string',
      },
      actions: {
        ['#description']: 'actions to be performed',
        ['#type']: 'array',
        items: {
          ['#type']: 'string',
        },
      },
      options: {
        ['#description']: 'list of options that can be passed to the command',
        ['#type']: 'array',
        items: {
          ['#type']: 'object',
          schema: {
            alias: {
              ['#description']: 'alias of the option',
              ['#type']: 'array',
              items: {
                ['#type']: 'string',
              },
            },
            label: {
              ['#description']: 'label of the option',
              ['#type']: 'string',
            },
            description: {
              ['#description']: 'description of the option',
              ['#type']: 'string',
            },
            type: {
              ['#description']: 'type of the option',
              ['#type']: 'string',
            },
            required: {
              ['#description']: 'whether the option is required',
              ['#type']: 'boolean',
            },
            default: {
              ['#description']: 'default value of the option',
              ['#type']: 'any',
            },
            examples: {
              ['#description']: 'examples of the option',
              ['#type']: 'array',
              items: {
                ['#type']: 'object|string',
                schema: {
                  value: {
                    ['#description']: 'one example for the option',
                    ['#type']: 'string',
                  },
                  description: {
                    ['#description']: 'descibe what this example does',
                    ['#type']: 'string',
                  },
                  alias: {
                    ['#description']: 'alias of this example (can be another command or option)',
                    ['#type']: 'array',
                    items: {
                      ['#type']: 'object',
                      schema: {
                        type: {
                          ['#description']: 'type of the example',
                          ['#type']: 'string',
                          ['#enum']: [
                            {
                              value: 'command',
                              description: 'tell that the value will be a complete command',
                            },
                            {
                              value: 'option',
                              description:
                                'tell that the value will be an option of the current command',
                            },
                          ],
                        },
                        value: {
                          ['#description']: 'value of the alias of the example',
                          ['#type']: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
            behavior: {
              ['#description']: 'behavior of the option',
              ['#type']: 'object',
              schema: {
                allowMultiple: {
                  ['#description']:
                    'whether the option can be passed multiple times or not (really useful for arrays)',
                  ['#type']: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  },
}
