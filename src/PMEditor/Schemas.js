import { Mark, Node as PMNode, Schema } from 'prosemirror-model'


export const deletion = {
    attrs: {
        user: {
            default: 0
        },
        username: {
            default: ""
        },
        date: {
            default: 0
        }
    },
    inclusive: false,
    group: "track",
    parseDOM: [
        {
            tag: "span.deletion",
            getAttrs(dom) {
                return {
                    user: parseInt(dom.dataset.user),
                    username: dom.dataset.username,
                    date: parseInt(dom.dataset.date)
                }
            }
        }
    ],
    toDOM(node) {
        return ["span", {
            class: `deletion user-${node.attrs.user}`,
            "data-user": node.attrs.user,
            "data-username": node.attrs.username,
            "data-date": node.attrs.date
        }]
    }
}
export const schema = new Schema({
    nodes: {
        doc: {
            content: 'block*',
        },
        text: {
            group: 'inline',
        },
        paragraph: {
            content: 'text*',
            group: 'block',
            attrs: { dataTracked: { default: null }, testAttribute: { default: null } },
            parseDOM: [{ tag: 'p' }],
            toDOM() {
                return ['p', 0]
            },
        },

    },
    marks: {

        italic: {
            attrs: { dataTracked: { default: null } },
            parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
            toDOM() {
                return ['em', 0]
            },
        },


        bold: {
            attrs: { dataTracked: { default: null } },
            parseDOM: [
                { tag: 'strong' },
                {
                    tag: 'b',
                    getAttrs: (dom) => {
                        if (dom instanceof HTMLElement) {
                            return dom.style.fontWeight !== 'normal' && null
                        }
                        return null
                    },
                },
                {
                    style: 'font-weight',
                    getAttrs: (dom) => {
                        if (typeof dom === 'string') {
                            return /^(bold(er)?|[5-9]\d{2,})$/.test(dom) && null
                        }
                        return null
                    },
                },
            ],
            toDOM() {
                return ['strong', 0]
            },
        },

        code: {
            attrs: { dataTracked: { default: null } },
            parseDOM: [{ tag: 'code' }],
            toDOM() {
                return ['code', 0]
            },
        },

        strikethrough: {
            attrs: { dataTracked: { default: null } },
            parseDOM: [
                { tag: 's' },
                { tag: 'strike' },
                { style: 'text-decoration=line-through' },
                { style: 'text-decoration-line=line-through' },
            ],
            toDOM: () => ['s'],
        },

        insertion: {
            attrs: { user: {}, username: {}, date: {}, approved: {} },
            parseDOM: [{ tag: "span[data-type='insertion']" }],
            toDOM(node) {
                return ["span", { class: "addition", "data-type": "insertion", "data-user": node.attrs.user }, 0];
            },
        },
        // deletion: deletion,
        deletion: {
            attrs: { user: {}, username: {}, date: {} },
            parseDOM: [{ tag: "span[data-type='insertion']" }],
            toDOM(node) {
                return ["span", { class: "deletion", "data-type": "deletion", "data-user": node.attrs.user }, 0];
            },
        },
        format_change: {
            attrs: { user: {}, username: {}, date: {}, before: {}, after: {} },
            parseDOM: [{ tag: "span[data-type='format_change']" }],
            toDOM(node) {
                return ["span", { class: "format", "data-type": "format_change", "data-user": node.attrs.user }, 0];
            },
        },
    },
})


