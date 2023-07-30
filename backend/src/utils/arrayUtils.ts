export const arraysAreEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i]._id !== arr2[i]._id || arr1[i].count !== arr2[i].count) {
      return false;
    }
  }

  return true;
};
