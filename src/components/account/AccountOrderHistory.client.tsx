import type {Order} from '@shopify/hydrogen/storefront-api-types';
import {Button, Text, OrderCard} from '~/components';

export function AccountOrderHistory({orders}: {orders: Order[]}) {
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="text-lead font-bold">Order History</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t placed any orders yet.
      </Text>
      <div className="w-48">
        <Button className="mt-2 w-full text-sm" variant="secondary" to={'/'}>
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

function Orders({orders}: {orders: Order[]}) {
  return (
    <ul className="false grid grid-flow-row grid-cols-1 gap-2 gap-y-6 sm:grid-cols-3 md:gap-4  lg:gap-6">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}
