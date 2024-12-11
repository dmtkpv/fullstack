// -------------------
// Set name
// -------------------

function name (imports) {
    return Object.keys(imports).reduce((result, path) => {
        const i1 = path.lastIndexOf('/') + 1;
        const i2 = path.lastIndexOf('.');
        const name = path.substring(i1, i2);
        result[name] = imports[path];
        return result;
    }, {})

}



// -------------------
// Exports
// -------------------

export const ui = name(import.meta.glob(['../ui/*.vue', '../ui/*.js'], {
    eager: true,
    import: 'default'
}));

export const units = name(import.meta.glob('../items/*.vue', {
    eager: true,
    import: 'default'
}));

export const landings = name(import.meta.glob('../landing/*.vue', {
    eager: true,
    import: 'default'
}));

export const layout = name(import.meta.glob('../layout/*.vue', {
    eager: true,
    import: 'default'
}));

export const modals = name(import.meta.glob('../modals/*.vue', {
    eager: true,
    import: 'default'
}));

export const inputs = name(import.meta.glob('../inputs/*.vue', {
    eager: true,
    import: 'default'
}));

export const icons = name(import.meta.glob('../icons/*.svg', {
    eager: true,
    import: 'default'
}));