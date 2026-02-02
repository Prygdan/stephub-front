'use clinet';

import React from 'react';
import { cn } from '@/lib/utils';
import { get as getAreas } from '@/services/delivery/areas';
import { show as showCities } from '@/services/delivery/cities';
import { show as showBranches } from '@/services/delivery/branches';
import { show as showPostomates } from '@/services/delivery/postomates';
import { InputCombobox } from '../inputs';
import { TArea } from '@/services/delivery/areas';
import { TCiti } from '@/services/delivery/cities';
import { TBranch } from '@/services/delivery/branches';
import { TPostomat } from '@/services/delivery/postomates';
import { TUser } from '@/hooks/use-auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TGuestDelivery } from '@/services/order';

interface Props {
  errors:     Record<string, string[]>
  user?:      TUser
  getData:    (data: TGuestDelivery) => void;
  className?: string
}

export const UserDelivery: React.FC<Props> = ({ user, errors, getData, className }) => {
  const [areas, setAreas] = React.useState<TArea[]>([]);
  const [cities, setCities] = React.useState<TCiti[]>([]);
  const [branches, setBranches] = React.useState<TBranch[]>([]);
  const [postomates, setPostomates] = React.useState<TPostomat[]>([]);

  const [selectedArea, setSelectedArea] = React.useState<{ ref: string, name: string } | null>(null);
  const [selectedCity, setSelectedCity] = React.useState<{ ref: string, name: string } | null>(null);
  const [selectedBranch, setSelectedBranch] = React.useState<{ ref: string, name: string } | null>(null);
  const [selectedPostomat, setSelectedPostomat] = React.useState<{ ref: string, name: string } | null>(null);

  const [isBranchSelected, setIsBranchSelected] = React.useState(false);
  const [isPostmatSelected, setIsPostmatSelected] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    const data = await getAreas();
    setLoading(false);
    setAreas(data.data.data);
  }

  const fetchCities = async (areaRef: string) => {
    setLoading(true);
    const data = await showCities(areaRef);
    setLoading(false);
    data && setCities(data);
  }

  const fetchBranches = async (cityRef: string) => {
    setLoading(true);
    const data = await showBranches(cityRef);
    setLoading(false);
    data && setBranches(data);
  }

  const fetchPostomates = async (cityRef: string) => {
    setLoading(true);
    const data = await showPostomates(cityRef);
    setLoading(false);
    data && setPostomates(data);
  }

  React.useEffect(() => {
    fetchAreas();
  }, []);

  React.useEffect(() => {
    if (user && user.guest?.area_ref && user.guest?.area) {
      setSelectedArea({ ref: user.guest.area_ref, name: user.guest.area });
    }
  }, [user]);

  React.useEffect(() => {
    if (user && user.guest?.city_ref && user.guest?.city && selectedArea) {
      fetchCities(selectedArea.ref);
      setSelectedCity({ ref: user.guest.city_ref, name: user.guest.city });
    } else if(selectedArea) {
      fetchCities(selectedArea.ref);
    }
  }, [selectedArea, user]);

  React.useEffect(() => {
    if(selectedCity) {
      fetchBranches(selectedCity.ref);
      fetchPostomates(selectedCity.ref);
    }

    if(user && user.guest?.branch && user.guest?.branch_ref && selectedCity) {
        /* User Selected Branch */
      setIsBranchSelected(true);
      setIsPostmatSelected(false);
      setSelectedBranch({ ref: user.guest.branch_ref, name: user.guest.branch });
    } else if(user && user.guest?.postomat && user.guest?.postomat_ref) {
        /* User Slelcted Postomat */
      setIsBranchSelected(false);
      setIsPostmatSelected(true);
      setSelectedPostomat({ ref: user.guest.postomat_ref, name: user.guest.postomat });
    } else {

    }
  }, [user, selectedCity]);

  React.useEffect(() => {
    const data: TGuestDelivery = {
      area:         selectedArea?.name,
      area_ref:     selectedArea?.ref,
      city:         selectedCity?.name,
      city_ref:     selectedCity?.ref,
      branch:       selectedBranch?.name,
      branch_ref:   selectedBranch?.ref,
      postomat:     selectedPostomat?.name,
      postomat_ref: selectedPostomat?.ref
    }
    getData(data);
  }, [selectedArea, selectedBranch, selectedCity, selectedPostomat]);

  return (
    <div className={cn(className)}>
      <span className='block uppercase text-[14px] font-bold tracking-wider'>Доставка</span>
      <div className='mt-2'>
        <InputCombobox
          label='Область'
          name='area'
          defaultValue={selectedArea?.ref}
          items={areas.map((area) => ({ value: area.ref, label: area.description }))}
          onSelect={(ref, name) => setSelectedArea({ref, name})}
          placeholder='Оберіть область'
          errors={errors?.area}
          labelClassName='font-light pb-0.5'
          loading={loading}
          required
        />
        <InputCombobox
          label='Місто'
          name='city'
          defaultValue={selectedCity?.ref}
          items={cities.map((citi) => ({ value: citi.ref, label: citi.description }))}
          onSelect={(ref, name) => setSelectedCity({ref, name})}
          placeholder='Спочатку оберіть область'
          errors={errors?.city}
          className='mt-5'
          labelClassName='font-light'
          loading={loading}
          required
        />
      </div>
      <div className='mt-8 font-light text-sm'>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='branch'
            checked={isBranchSelected}
            onCheckedChange={(checked) => {
              setIsBranchSelected(checked as boolean);
              setIsPostmatSelected(false);
            }}
          />
          <div className='flex items-center gap-1'>
            <span><svg viewBox="0 0 18 19" fill="none" width="18px" height="18px"><path d="M10.394 14.154v-3.426H7.481v3.427H5.253l2.701 2.702a1.389 1.389 0 0 0 1.965 0l2.701-2.702h-2.226v-.001Zm-6.597-1.456V5.33L1.094 8.031a1.389 1.389 0 0 0 0 1.964l2.703 2.703Zm3.684-8.825V7.3h2.913V3.873h2.228L9.92 1.171a1.389 1.389 0 0 0-1.965 0L5.253 3.873h2.228Zm9.3 4.158-2.702-2.702v7.37l2.701-2.702a1.39 1.39 0 0 0 0-1.966Z" fill="#DA292B"></path></svg></span>
            <Label htmlFor='branch' className='block'>Нова пошта відділення</Label>
          </div>
        </div>

        {isBranchSelected && (
          <InputCombobox
            label='Відділення'
            name='branch'
            defaultValue={selectedBranch?.ref}
            items={branches.map((branch) => ({ value: branch.ref, label: branch.description }))}
            onSelect={(ref, name) => setSelectedBranch({ref, name})}
            placeholder='Спочатку виберіть місто'
            className='mt-3 pb-5'
            labelClassName='font-light pb-0.5'
            errors={errors?.branch}
            loading={loading}
            required
          />
        )}

        <div className='mt-3 flex items-center gap-2'>
          <Checkbox
            id='postomat'
            checked={isPostmatSelected}
            onCheckedChange={(checked) => {
              setIsPostmatSelected(checked as boolean);
              setIsBranchSelected(false);
            }}
          />
          <div className='flex items-center gap-1'>
            <span><svg viewBox="0 0 18 19" fill="none" width="18px" height="18px"><path d="M10.394 14.154v-3.426H7.481v3.427H5.253l2.701 2.702a1.389 1.389 0 0 0 1.965 0l2.701-2.702h-2.226v-.001Zm-6.597-1.456V5.33L1.094 8.031a1.389 1.389 0 0 0 0 1.964l2.703 2.703Zm3.684-8.825V7.3h2.913V3.873h2.228L9.92 1.171a1.389 1.389 0 0 0-1.965 0L5.253 3.873h2.228Zm9.3 4.158-2.702-2.702v7.37l2.701-2.702a1.39 1.39 0 0 0 0-1.966Z" fill="#DA292B"></path></svg></span>
            <Label htmlFor='postomat' className='block'>Нова пошта поштомат</Label>
          </div>
        </div>

        {isPostmatSelected && (
          <InputCombobox
            label='Поштомат'
            name='postomat'
            defaultValue={selectedPostomat?.ref}
            items={postomates.map((postomat) => ({ value: postomat.ref, label: postomat.description }))}
            onSelect={(ref, name) => setSelectedPostomat({ref, name})}
            errors={errors?.postomat}
            placeholder='Спочатку виберіть місто'
            className='mt-3 pb-5'
            labelClassName='font-light pb-0.5'
            loading={loading}
            required
          />
        )}
      </div>
    </div>
  );
};
