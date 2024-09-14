// src/app/myParameters/page.tsx
"use client";

import ParameterList from '../components/ParameterList';
import withAuth from '@/app/components/withAuth'

function MyParametersPage() {
  return (
    <div>
      <ParameterList />
    </div>
  );
}
export default withAuth(MyParametersPage);
