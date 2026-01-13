/**
 * 商品数据模块
 * 存储所有商品信息
 */

/**
 * 商品数据模块
 * 存储所有商品信息
 */

export const products = [
  {
    id: 1,
    name: '精品商品 1',
    description: '高品质精选商品，为您带来卓越体验',
    price: 299,
    category: '电子产品',
    dateAdded: '2024-01-15',
    image: {
      gradient: 'from-indigo-400 to-purple-500'
    }
  },
  {
    id: 2,
    name: '精品商品 2',
    description: '设计精美，品质保证',
    price: 399,
    category: '家居用品',
    dateAdded: '2024-01-20',
    image: {
      gradient: 'from-pink-400 to-red-500'
    }
  },
  {
    id: 3,
    name: '精品商品 3',
    description: '时尚潮流，值得拥有',
    price: 499,
    category: '服装配饰',
    dateAdded: '2024-01-25',
    image: {
      gradient: 'from-green-400 to-blue-500'
    }
  },
  {
    id: 4,
    name: '精品商品 4',
    description: '优质材料，精心制作',
    price: 199,
    category: '电子产品',
    dateAdded: '2024-02-01',
    image: {
      gradient: 'from-yellow-400 to-orange-500'
    }
  },
  {
    id: 5,
    name: '精品商品 5',
    description: '经典款式，永不过时',
    price: 599,
    category: '服装配饰',
    dateAdded: '2024-02-05',
    image: {
      gradient: 'from-blue-400 to-indigo-500'
    }
  },
  {
    id: 6,
    name: '精品商品 6',
    description: '实用性强，性价比高',
    price: 149,
    category: '家居用品',
    dateAdded: '2024-02-10',
    image: {
      gradient: 'from-purple-400 to-pink-500'
    }
  },
  {
    id: 7,
    name: '精品商品 7',
    description: '创新设计，引领潮流',
    price: 699,
    category: '电子产品',
    dateAdded: '2024-02-15',
    image: {
      gradient: 'from-teal-400 to-cyan-500'
    }
  },
  {
    id: 8,
    name: '精品商品 8',
    description: '舒适体验，品质生活',
    price: 249,
    category: '家居用品',
    dateAdded: '2024-02-20',
    image: {
      gradient: 'from-red-400 to-pink-500'
    }
  },
  {
    id: 9,
    name: '精品商品 9',
    description: '时尚百搭，个性十足',
    price: 349,
    category: '服装配饰',
    dateAdded: '2024-02-25',
    image: {
      gradient: 'from-green-400 to-emerald-500'
    }
  }
];

/**
 * 获取所有商品分类
 * @returns {Array} 分类数组
 */
export function getCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.sort();
}
