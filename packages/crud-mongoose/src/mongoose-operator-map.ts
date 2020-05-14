export const MONGOOSE_OPERATOR_MAP: { [key: string]: (value?: any) => any } = {
  $eq: (value) => ({
    $eq: value,
  }),
  $ne: (value) => ({
    $ne: value,
  }),
  $gt: (value) => ({ $gt: value }),
  $lt: (value) => ({ $lt: value }),
  $gte: (value) => ({ $gte: value }),
  $lte: (value) => ({ $lte: value }),
  $in: (value) => ({ $in: value }),
  $notin: (value) => ({ $nin: value }),
  $isnull: () => ({ $eq: null }),
  $notnull: () => ({ $ne: null }),
  $between: (value: any[]) => ({ $gt: Math.min(...value), $lt: Math.max(...value) }),
  $starts: (value) => ({ $regex: `/^${value}.*$/` }),
  $end: (value) => ({ $regex: `/^.*${value}$/` }),
  $cont: (value) => ({ $regex: `/^.*${value}.*$/` }),
  $excl: (value) => ({ $regex: `/^((?!${value}).)*$/` }),
};
