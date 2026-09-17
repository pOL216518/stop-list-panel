'use client';

import { useMenuItems } from '../model/queries';

export function StopListTable() {
  const { data, isPending, isError, error } = useMenuItems(null);

  if (isPending) {
    return <p>Загрузка меню…</p>;
  }

  if (isError) {
    return <p role="alert">Ошибка: {error.message}</p>;
  }

  if (data.length === 0) {
    return <p>Меню смены пусто.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Цех</th>
          <th>Остаток</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.shop}</td>
            <td>{item.stock}</td>
            <td>
              {item.status.kind === 'available' ? 'в продаже' : `стоп: ${item.status.reason}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}