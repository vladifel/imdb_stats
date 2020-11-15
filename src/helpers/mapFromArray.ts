export const mapFromArray = (list: any[], keyByProp: string) => {
    var map: any = {};
    for (var i = 0, item; item = list[i]; i++) {
        map[item[keyByProp].toLowerCase()] = item;
    }
    return map;
};