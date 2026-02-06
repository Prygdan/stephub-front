import { TSize } from "@/services/sizes";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TSearchParams } from "./types";
import { TSubcategory } from "@/services/subcategories";
import { TCategory } from "@/services/categories";
import { OrderStatusLabel } from "@/services/orders";
import { TBrand } from "@/services/brands";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Array filter for category and subcategory
 */
export const ALL_FILTERS = [
  { value: "brands",      label: "Бренди" },
  { value: "sizes",         label: "Розміри" },
  { value: "seasons",       label: "Сезон" },
  { value: "materials",     label: "Матеріал" },
  { value: "categories",    label: "Категорія" },
  { value: "subcategories", label: "Підкатегорія" },
];

export const isSize = (sizes: unknown): sizes is TSize => {
  return typeof sizes === 'object' && sizes !== null && 'id' in sizes;
};

type IsAllowedProps = {
  filter:       keyof TSearchParams
  subcategory?: TCategory | TSubcategory | TBrand
}

export const isAllowed = ({ filter, subcategory }: IsAllowedProps) => {
  return subcategory?.allowed_filters?.includes(filter) ?? false;
};

export const replacer = (key: string, value: any) => {
  if (key === 'agent' || key === 'sockets' || key === '_httpMessage') {
    return undefined; // Вигружаємо ці об'єкти
  }
  return value;
};

function isCategory(type: any): type is TCategory {
  return 'subcategories' in type
}

function isSubcategory(type: any): type is TSubcategory {
  return 'category_id' in type
}

export const whoIsType = (type: TCategory | TSubcategory | TBrand) => {
  if (isCategory(type)) {
    return 'categories'
  } else if (isSubcategory(type)) {
    return 'subcategories'
  } else {
    return 'brands'
  }
}

export const handleChangePhone = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPhone: (val: string) => void
) => {
  let value = e.target.value;

  // Дозволяємо видаляти або залишати лише "+"
  if (value === '' || value === '+' || value === '+3' || value === '+38') {
    return setPhone(value);
  }

  // Залишаємо тільки цифри
  const numeric = value.replace(/\D/g, '');

  // Якщо користувач видалив все і намагається знову вводити з 0, наприклад
  if (!numeric.startsWith('380')) {
    if (numeric.startsWith('0')) {
      // Замінюємо 0 на 380
      return setPhone('+380' + numeric.slice(1, 9));
    } else {
      // Якщо немає 380 — не змінюємо state, дозволяємо вручну ввести
      return setPhone('+' + numeric);
    }
  }

  // Обрізаємо зайві цифри
  const phone = '+380' + numeric.slice(3, 9 + 3); // 9 цифр після 380
  setPhone(phone);
};

export const OrderStatusArray = Object.entries(OrderStatusLabel).map(([key, value]) => ({
  id: Number(key),
  name: value
}));

/**
 * Triggers revalidation for related cached resources.
 * Intended to be called after successful create/update/delete operations.
 */
type TRelativeDBCache = {
  categories?: boolean;
  subcategories?: boolean;
  products?: boolean;
  brands?: boolean;
  pages?: boolean
};

const REVALIDATE_ENDPOINTS: Record<keyof TRelativeDBCache, string> = {
  categories: '/api/revalidate-category',
  subcategories: '/api/revalidate-subcategory',
  products: '/api/revalidate-products',
  brands: '/api/revalidate-brand',
  pages: '/api/revalidate-page',
};

export const revalidateRelatedCache = async (
  flags: TRelativeDBCache
) => {
  const requests = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([key]) =>
      fetch(REVALIDATE_ENDPOINTS[key as keyof TRelativeDBCache], {
        method: 'POST',
      })
    );

  try {
    await Promise.all(requests);
  } catch (error) {
    console.error('Cache revalidation failed:', error);
  }
};

export function hasActiveFilters(filters: TSearchParams, page: number = 1): boolean {
  // page > 1 завжди вважаємо "активним" (пагінація впливає на вміст)
  if (page > 1) return true;

  // Перевіряємо всі поля, які можуть бути заповнені користувачем
  return Boolean(
    filters.priceFrom ||
    filters.priceTo ||
    filters.sizes ||
    filters.brands ||
    filters.seasons ||
    filters.materials ||
    filters.categories ||
    filters.subcategories
  );
}