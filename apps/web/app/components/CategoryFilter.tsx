interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'nature', name: '自然' },
    { id: 'abstract', name: '抽象' },
    { id: 'minimal', name: '简约' },
    { id: 'dark', name: '暗色' },
    { id: 'colorful', name: '彩色' },
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-8" id="wallpapers">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-2 rounded-full font-medium transition ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

