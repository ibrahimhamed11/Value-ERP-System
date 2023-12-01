import { default as dayjs } from 'dayjs';

export const formatDate = (date) => dayjs(date).format('MMMM D, YYYY h:mm A');

const changeChildrenToSubRows = (obj) => {
  if (obj.children && Array.isArray(obj.children)) {
    obj.subRows = obj.children.map((child) => changeChildrenToSubRows(child));
    delete obj.children;
  }
  return obj;
};

export const convertDataWithSubRows = (data) => {
  return data.map((item) => changeChildrenToSubRows(item));
};

export function flattenArrayWithParentId(arr, parentId) {
  let result = [];

  for (const item of arr) {
    const newItem = { ...item.item, parentId };
    result.push(newItem);

    if (item.children && item.children.length > 0) {
      const children = flattenArrayWithParentId(item.children, item.item.id);
      result = result.concat(children);
    }
  }

  return result;
}


const removeElementFromArray = (arr, id) =>
  arr.flatMap((o) => (o.id === id ? [] : [removeElement(o, id)]));

export const removeElement = (obj, id) =>
  Array.isArray(obj)
    ? removeElementFromArray(obj, id)
    : { ...obj, ...(obj.subRows ? { subRows: removeElementFromArray(obj.subRows, id) } : {}) };



     //Handel Data to be Ready for excel exporting
     export const flattenData = (data) => {
      const flattenedData = [];
      const flattenObject = (item, depth = 0, parentIndex = 0) => {
        if (typeof item === 'object') {
          const newItem = {
            depth: depth,
            parent: parentIndex,
            costCenterNo:item.item.costCenterNo,
            EnglishName: item.item.nameEn,
            ArabicName: item.item.nameAr
          };
          flattenedData.push(newItem);
          const currentItemIndex = flattenedData.length - 1;
          if (item.subRows && item.subRows.length > 0) {
            for (const subItem of item.subRows) {
              flattenObject(subItem, depth + 1, currentItemIndex);
            }
          }
        }
      };
  
      for (const item of data) {
        flattenObject(item);
      }
  
      return flattenedData;
    };
  


    //Handel Flat GL ACCOUNT 
    export const flatenGl = (data) => {
      const flattenedData = [];
  
  
      
      const flattenObject = (item, depth = 0, parentIndex = 0) => {
        if (typeof item === 'object') {
          const newItem = {
            depth: depth,
            accountNo: item.accountNo,
            EnglishName: item.nameEn,
            ArabicName: item.nameAr
          };
          flattenedData.push(newItem);
  
          const currentItemIndex = flattenedData.length - 1;
  
          if (item.subRows && item.subRows.length > 0) {
            for (const subItem of item.subRows) {
              flattenObject(subItem, depth + 1, currentItemIndex);
            }
          }
        }
      };
  
      for (const item of data) {
        flattenObject(item);
      }
  
      return flattenedData;
    };




      //Handel Flat Journal  
      export const flatJournal = (data) => {
        const flattenedData = [];
    
    
        
        const flattenObject = (item, depth = 0, parentIndex = 0) => {
          if (typeof item === 'object') {
            const newItem = {
              // depth: depth,
              serialNo: item.serialNo,
              description: item.description,
              reference: item.reference,
              sourceType:item.sourceType,
              sourceApplication:item.sourceApplication,
              creationTime:item.creationTime
            };
            flattenedData.push(newItem);
    
            const currentItemIndex = flattenedData.length - 1;
    
            if (item.subRows && item.subRows.length > 0) {
              for (const subItem of item.subRows) {
                flattenObject(subItem, depth + 1, currentItemIndex);
              }
            }
          }
        };
    
        for (const item of data) {
          flattenObject(item);
        }
    
        return flattenedData;
      };