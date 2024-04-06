import tailwindColors from 'tailwindcss/colors'

// [`start-active-red`]: cn(`[&:not(aria-selected)]:bg-red-600 rounded-r-none rounded-l-md dark:text-white`, asToHandleOnDayMouseEnter ? 'hover:bg-red-600 hover:text-white' : 'hover:bg-red-600'),
// [`start-inactive-red`]: cn(`[&:not(aria-selected)]:bg-red-300 rounded-r-none rounded-l-md dark:text-black`, asToHandleOnDayMouseEnter ? 'hover:bg-red-600' : 'hover:bg-red-300'),
// [`middle-inactive-red`]: cn(`[&:not(aria-selected)]:bg-red-300 rounded-none dark:text-black`, asToHandleOnDayMouseEnter ? 'hover:bg-red-600' : 'hover:bg-red-300'),
// [`middle-active-red`]: cn(`[&:not(aria-selected)]:bg-red-600 rounded-none dark:text-white`, asToHandleOnDayMouseEnter ? 'hover:bg-red-600 hover:text-white' : 'hover:bg-red-600'),
// [`end-active-red`]: cn(`[&:not(aria-selected)]:bg-red-600 rounded-l-none rounded-r-md dark:text-white`, asToHandleOnDayMouseEnter ? 'hover:bg-red-600 hover:text-white' : 'hover:bg-red-600'),
// [`end-inactive-red`]: cn(`[&:not(aria-selected)]:bg-red-300 rounded-l-none rounded-r-md dark:text-black`, asToHandleOnDayMouseEnter ? 'hover:bg-red-600' : 'hover:bg-red-300'),

export const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'cyan',
    'pink',
    'gray',
]

const activeTone = {
    default: 600,
    hoverAsToHandleOnDayMouseEnter: 600,
    hoverNotAsToHandleOnDayMouseEnter: 600,
    middle: 600,
    start: 600,
    end: 600,
}

const inactiveTone = {
    default: 300,
    hoverAsToHandleOnDayMouseEnter: 600,
    hoverNotAsToHandleOnDayMouseEnter: 300,
    middle: 300,
    start: 500,
    end: 500,
}

const generateColor = (color: string) => {
    const generate = (
        position: 'start' | 'middle' | 'end',
        active: boolean
    ) => {
        const generateBackgroundColorWithNoIntersect = () => {
            const generateBorderRadius = (
                position: 'start' | 'middle' | 'end'
            ) => {
                switch (position) {
                    case 'start':
                        return `
                            border-top-left-radius: calc(var(--radius) - 2px);
                            border-bottom-left-radius: calc(var(--radius) - 2px);
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                        `
                    case 'middle':
                        return `border-radius: 0;`
                    case 'end':
                        return `
                            border-top-right-radius: calc(var(--radius) - 2px);
                            border-bottom-right-radius: calc(var(--radius) - 2px);
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        `
                }
            }
            const generateAfter = () => {
                return `
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    border-top-left-radius: calc(var(--radius) - 2px);
                    border-bottom-left-radius: calc(var(--radius) - 2px);
                    content: '';
                `
            }
            const generateBefore = () => {
                return `
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    border-top-right-radius: calc(var(--radius) - 2px);
                    border-bottom-right-radius: calc(var(--radius) - 2px);
                    content: '';
                `
            }
            const generatePortion = (
                of: number,
                pseudoElement: 'after' | 'before'
            ) => {
                return (
                    Array.from({ length: of }, (_, i) => {
                        return `
                        .rdp .custom-day:not([aria-selected]).${position}-day-${color}-${
                            i + 1
                        }-${of}${active ? '-active' : '-inactive'} {
                            color: ${
                                active
                                    ? tailwindColors.white
                                    : tailwindColors.black
                            };
                        }
                        .rdp .custom-day:not([aria-selected]).${position}-day-${color}-${
                            i + 1
                        }-${of}${
                            active ? '-active' : '-inactive'
                        }::${pseudoElement} {
                            width: calc((100%/${of})*${i + 1});
                            z-index: -1;
                            background-color: ${
                                (tailwindColors as any)[color][
                                    active
                                        ? activeTone[position]
                                        : inactiveTone[position]
                                ]
                            };
                            ${
                                pseudoElement === 'after'
                                    ? generateAfter()
                                    : generateBefore()
                            }
                        }
                        .rdp .custom-day:not([aria-selected]).${position}-day-${color}-${
                            i + 1
                        }-${of}${
                            active ? '-active' : '-inactive'
                        }-asToHandleOnDayMouseEnter::${pseudoElement} {
                            width: calc((100%/${of})*${i + 1});
                            z-index: -1;
                            background-color: ${
                                (tailwindColors as any)[color][
                                    active
                                        ? activeTone[position]
                                        : inactiveTone[position]
                                ]
                            };
                            ${
                                pseudoElement === 'after'
                                    ? generateAfter()
                                    : generateBefore()
                            }
                        }
                        .rdp .custom-day:not([aria-selected]).${position}-day-${color}-${
                            i + 1
                        }-${of}${
                            active ? '-active' : '-inactive'
                        }-asToHandleOnDayMouseEnter {
                            background-color: inherit;
                        }
                    `
                    }).join('') +
                    `
                    .rdp .custom-day:not([aria-selected]).${position}-day-${color}${
                        active ? '-active' : '-inactive'
                    }::${pseudoElement}:hover {
                        z-index: 0;
                        background-color: ${
                            (tailwindColors as any)[color][
                                active
                                    ? activeTone[position]
                                    : inactiveTone[position]
                            ]
                        };
                    }
                `
                )
            }
            return `
                .rdp .custom-day:not([aria-selected]).${position}-day-${color}.${
                active ? 'active' : 'inactive'
            } {
                    background-color: ${
                        (tailwindColors as any)[color][
                            active
                                ? activeTone[position]
                                : inactiveTone[position]
                        ]
                    };
                    ${generateBorderRadius(position)}
                }
                .rdp .custom-day:not([aria-selected]).${position}-day-${color}:hover.${
                active ? 'active' : 'inactive'
            }.asToHandleOnDayMouseEnter {
                    background-color: ${
                        (tailwindColors as any)[color][
                            active
                                ? activeTone[position]
                                : inactiveTone[position]
                        ]
                    };
                }
                .rdp .custom-day:not([aria-selected]).${position}-day-${color}:hover.${
                active ? 'active' : 'inactive'
            }:not(.asToHandleOnDayMouseEnter) {
                    background-color: ${
                        (tailwindColors as any)[color][
                            active
                                ? activeTone[position]
                                : inactiveTone[position]
                        ]
                    };
                }
                
                ${
                    position === 'start'
                        ? `
                    ${generatePortion(2, 'after')}
                    ${generatePortion(3, 'after')}
                    ${generatePortion(4, 'after')}
                `
                        : position === 'end'
                        ? `
                    ${generatePortion(2, 'before')}
                    ${generatePortion(3, 'before')}
                    ${generatePortion(4, 'before')}
                `
                        : ''
                }
            `
        }
        return `
            ${generateBackgroundColorWithNoIntersect()}
        `
    }
    return `
        ${generate('start', true)}
        ${generate('start', false)}
        ${generate('middle', false)}
        ${generate('middle', true)}
        ${generate('end', true)}
        ${generate('end', false)}
    `
}

const start = Date.now()
console.log('START:', start)

const css: string = `${colors.map(generateColor).join('')}`

console.log('END:', Date.now())
console.log('CSS GENERATED IN :', Date.now() - start + 'ms')

// remove all breaklines and double spaces
export default css.replace(/\s+/g, ' ').trim()
