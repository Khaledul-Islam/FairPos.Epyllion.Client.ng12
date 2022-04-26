import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grdFilter',
})
export class GrdFilterPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    var newItem: any[] = [];

    for (var i = 0; i < items.length; i++) {
      if (items[i].ParentID == (filter.ParentID as string)) {
        newItem.push(items[i]);
      }
    }
    return newItem;

    // if (filter && Array.isArray(items)) {
    //   let filterKeys = Object.keys(filter);

    //   if (defaultFilter) {
    //     return items.filter(item =>
    //         filterKeys.reduce((x, keyName) =>
    //             (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
    //   }
    //   else {
    //     return items.filter(item => {
    //       return filterKeys.some((keyName) => {
    //         return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
    //       });
    //     });
    //   }
    // }
  }
}
