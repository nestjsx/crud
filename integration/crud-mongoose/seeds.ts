export const seedUsers = [
  { name: 'jay', _id: '5de34417cd5e475f96a46583', password: '1' },
  { name: 'john', _id: '5de34417cd5e475f96a46584', password: '1' },
  { name: 'jim', _id: '5de34417cd5e475f96a46585', password: '1' },
  { name: 'jay1', _id: '5de34417cd5e475f96a46586', password: '1' },
  { name: 'john1', _id: '5de34417cd5e475f96a46587', password: '1' },
  { name: 'jim1', _id: '5de34417cd5e475f96a46588', password: '1' },
  { name: 'jay2', _id: '5de34417cd5e475f96a46589', password: '1' },
  { name: 'john2', _id: '5de34417cd5e475f96a46590', password: '1' },
  { name: 'jim2', _id: '5de34417cd5e475f96a46591', password: '1' }
];

export const seedPosts = [
  {
    id: '1',
    title: 'Title 1',
    userId: '5de34417cd5e475f96a46583',
    _id: '5de34417cd5e475f96a46583'
  },
];

export const seedComments = [
  {
    _id: '5de34417cd5e475f96a46584',
    postId: '5de34417cd5e475f96a46583',
    userId: '5de34417cd5e475f96a46583',
  },
];
