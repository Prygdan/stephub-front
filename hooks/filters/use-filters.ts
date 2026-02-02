import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';

interface PriceProps {
  priceFrom?:   number;
  priceTo?:     number;
}

interface QueryFilters extends PriceProps {
  brands:             string;
  categories:         string,
  subcategories:      string,
  seasons:            string,
  sizes:              string,
  materials:          string,
}

export interface Filters {
  prices:             PriceProps;
  brands:             Set<string>;
  categories:         Set<string>;
  subcategories:      Set<string>;
  seasons:            Set<string>;
  materials:          Set<string>;
  sizes:              Set<string>;
}

export interface ReturnFiltersProps extends Filters {
  setPrices:          (name: keyof PriceProps, value: number) => void;
  setBrands:          (value: string) => void;
  setCategories:      (value: string) => void;
  setSubcategories:   (value: string) => void;
  setSeasons:         (value: string) => void;
  setMaterials:       (value: string) => void;
  setSizes:           (value: string) => void;

  resetPrices:        () => void
  resetBrands:        () => void 
  resetCategories:    () => void
  resetSubcategories: () => void
  resetSeasons:       () => void
  resetMaterials:     () => void
  resetSizes:         () => void
}

export const useFilters = (): ReturnFiltersProps => {
  const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

  const [ brands, { toggle: toggleBrands } ] = useSet(
    new Set<string>(searchParams.has('brands') ? searchParams.get('brands')?.split(',') : []),
  );
  const [ categories, { toggle: toggleCategories } ] = useSet(
    new Set<string>(searchParams.has('categories') ? searchParams.get('categories')?.split(',') : []),
  );
  const [ subcategories, { toggle: toggleSubcategories } ] = useSet(
    new Set<string>(searchParams.has('subcategories') ? searchParams.get('subcategories')?.split(',') : []),
  );
  const [ seasons, { toggle: toggleSeasons } ] = useSet(
    new Set<string>(searchParams.has('seasons') ? searchParams.get('seasons')?.split(',') : []),
  );
  const [ materials, { toggle: toggleMaterials } ] = useSet(
    new Set<string>(searchParams.has('materials') ? searchParams.get('materials')?.split(',') : []),
  );
  const [ sizes, { toggle: toggleSizes } ] = useSet(
    new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : []),
  );

  const [ prices, setPrices ] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrices((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetPrices = () => {
    setPrices({
      priceFrom:  undefined,
      priceTo:    undefined,
    });
  };

  const resetBrands = () => {
    brands.forEach((brand) => toggleBrands(brand));
  };
  const resetCategories = () => {
    categories.forEach((category) => toggleCategories(category));
  };
  const resetSubcategories = () => {
    subcategories.forEach((subcategory) => toggleSubcategories(subcategory));
  };
  const resetMaterials = () => {
    materials.forEach((material) => toggleMaterials(material));
  };
  const resetSeasons = () => {
    seasons.forEach((season) => toggleSeasons(season));
  };
  const resetSizes = () => {
    sizes.forEach((size) => toggleSizes(size));
  };

  return React.useMemo(
    () => ({
      prices,
      brands,
      seasons,
      materials,
      categories,
      subcategories,
      sizes,
  
      setPrices:        updatePrice,
      setBrands:        toggleBrands,
      setSeasons:       toggleSeasons,
      setMaterials:     toggleMaterials,
      setCategories:    toggleCategories,
      setSubcategories: toggleSubcategories,
      setSizes:         toggleSizes,
      

      resetPrices,
      resetBrands,
      resetCategories,
      resetSubcategories,
      resetSeasons,
      resetSizes,
      resetMaterials,
    }),
    [
      categories, subcategories,
      brands, materials, prices, sizes, seasons,
    ],
  );
};
