const dynamicSort = (property: string) => {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a: any, b: any): number => {
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export const dynamicSortMultiple = (...args: Array<string>) => {
    const props = args;
    return (obj1: any, obj2: any): number => {
        let i = 0,
            result = 0,
            // eslint-disable-next-line prefer-const
            numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}