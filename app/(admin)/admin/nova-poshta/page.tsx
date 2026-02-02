import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <div>
    <Link href={'/admin/nova-poshta/key'}>Ключ</Link><br/>
      <Link href={'/admin/nova-poshta/areas'}>База областей</Link><br/>
      <Link href={'/admin/nova-poshta/cities'}>База міст</Link><br/>
      <Link href={'/admin/nova-poshta/branches'}>База відділень</Link><br/>
      <Link href={'/admin/nova-poshta/postomates'}>База поштоматів</Link><br/>
    </div>
  );
};
