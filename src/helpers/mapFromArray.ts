import { IPersonData } from "../features/types";

export const mapFromArray = (list: IPersonData[]) => {
  var map = new Map<string, IPersonData>();
  list.forEach(entry => map.set(entry.Name.toLowerCase(), entry));
  return map;
};
