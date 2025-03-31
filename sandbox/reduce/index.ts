/*
РЕАЛЬНАЯ БОЕВАЯ ЗАДАЧА
Вам дан массив трафика, снятого с лоад балансера, например с NGINX.
Трафик пишется очень детально:
* sourceIp, destinationIp - с какого IP адреса и на какой шел запрос
* sourcePort, destinationPort - с какого порта и на какой шел запрос
* timestamp - таймстайп, то есть дата, представленная в числовом формате (загуглите unix timestamp)
* protocol - протокол передачи данных, поддерживается только TCP и UDP
* bytes - объём переданных данных

Для отображения в личном кабинете такие метрики не подойдут - они слишком детализированы.
Ваша задача - съагрегировать/сгруппировать трафик по destinationIp и минутам, и вывести общую сумму байтов для каждого
айпи адреса и времени, отсортированную по времени.

То есть, вы должны указать, сколько всего пришло байт за каждую минуту для каждого айпи адреса, не важно
по какому протоколу, порту и с какого айпи адреса.
Например, если у нас есть такие данные (показываю в упрощенном виде):
* целевой айпи: 10.0.0.1, время: 10:00:30, протокол: TCP, исходящий IP: 33.33.33.33, байты: 50
* целевой айпи: 10.0.0.1, время: 10:00:59, протокол: UDP, исходящий IP: 54.244.09.54, байты: 30
* целевой айпи: 10.0.0.1, время: 10:00:01, протокол: TCP, исходящий IP: 127.0.0.1, байты: 60
* целевой айпи: 10.0.0.1, время: 10:01:01, протокол: UDP, исходящий IP: 255.255.0.1, байты: 17
* целевой айпи: 10.0.0.1, время: 10:01:56, протокол: TCP, исходящий IP: 54.244.09.54, байты: 45
* целевой айпи: 10.0.0.1, время: 10:02:00, протокол: TCP, исходящий IP: 127.0.0.1, байты: 7
* целевой айпи: 10.0.0.1, время: 10:02:59, протокол: UDP, исходящий IP: 33.33.33.33, байты: 2

То вы должны вывести, что на айпи адрес 10.0.0.1 был такой трафик:
* за всю минуту 10:00:00 пришло в сумме 140 байт (50 + 30 + 60)
* за всю минуту 10:01:00 пришло в сумме 62 байта (17 + 45)
* за всю минуту 10:02:00 пришло в сумме 9 байтов (7 + 2)

То есть мы берем сумму по всем портам, протоколам, исходящим айпи адреса, конкретно для этого айпи адреса и одной минуты.

=== Рекомендации
Для парсинга unix timestamp рекомендую использовать dayjs.
Для округления текущего времени вниз до полной минуты рекомендую использовать метод .startOf() объекта dayjs.
Личное моё решение заняло 1 внешний reduce и внутри него 3 вложенных редюса.

=== SQL
Если бы мы писали SQL запрос, то он выглядел бы так:
select destinationIp, toStartOfMinute(timestamp), sum(bytes)
from traffic
group by destinationIp, toStartOfMinute(timestamp)
order by toStartOfMinute(timestamp) asc

=== Ожидаемый вывод программы:
{
  '10.0.0.1': [
    { timestamp: '2024-05-23T14:37:00.000Z', bytes: 6912 },
    { timestamp: '2024-05-23T14:38:00.000Z', bytes: 12468 },
    { timestamp: '2024-05-23T14:39:00.000Z', bytes: 20235 },
    { timestamp: '2024-05-23T14:40:00.000Z', bytes: 6789 }
  ],
  '255.78.3.9': [
    { timestamp: '2024-05-23T14:37:00.000Z', bytes: 6932 },
    { timestamp: '2024-05-23T14:38:00.000Z', bytes: 3072 },
    { timestamp: '2024-05-23T14:39:00.000Z', bytes: 12288 },
    { timestamp: '2024-05-23T14:40:00.000Z', bytes: 2000 }
  ]
}

 */

import dayjs from 'dayjs';

type Protocol = 'TCP' | 'UDP';

type Traffic = {
  id: number;

  sourceIp: string;
  destinationIp: string;

  sourcePort: number;
  destinationPort: number;

  timestamp: number;
  protocol: Protocol;
  bytes: number;
};

const traffic: Traffic[] = [
  {
    id: 1,
    sourceIp: '192.168.1.10',
    destinationIp: '10.0.0.1',
    sourcePort: 50001,
    destinationPort: 80,
    timestamp: 1716475020000,
    protocol: 'TCP',
    bytes: 1234,
  }, // May 23, 2024 00:57:00 UTC
  {
    id: 41,
    sourceIp: '192.168.1.13',
    destinationIp: '255.78.3.9',
    sourcePort: 50004,
    destinationPort: 21,
    timestamp: 1716475110000,
    protocol: 'TCP',
    bytes: 1024,
  }, // May 23, 2024 00:58:30 UTC
  {
    id: 3,
    sourceIp: '192.168.1.12',
    destinationIp: '10.0.0.1',
    sourcePort: 50003,
    destinationPort: 53,
    timestamp: 1716475080000,
    protocol: 'UDP',
    bytes: 9012,
  }, // May 23, 2024 00:58:00 UTC
  {
    id: 51,
    sourceIp: '192.168.1.14',
    destinationIp: '255.78.3.9',
    sourcePort: 50005,
    destinationPort: 8080,
    timestamp: 1716475140000,
    protocol: 'UDP',
    bytes: 4096,
  }, // May 23, 2024 00:59:00 UTC
  {
    id: 4,
    sourceIp: '192.168.1.13',
    destinationIp: '10.0.0.1',
    sourcePort: 50004,
    destinationPort: 21,
    timestamp: 1716475110000,
    protocol: 'TCP',
    bytes: 3456,
  }, // May 23, 2024 00:58:30 UTC
  {
    id: 5,
    sourceIp: '192.168.1.14',
    destinationIp: '10.0.0.1',
    sourcePort: 50005,
    destinationPort: 8080,
    timestamp: 1716475140000,
    protocol: 'TCP',
    bytes: 7890,
  }, // May 23, 2024 00:59:00 UTC
  {
    id: 31,
    sourceIp: '192.168.1.12',
    destinationIp: '255.78.3.9',
    sourcePort: 50003,
    destinationPort: 53,
    timestamp: 1716475080000,
    protocol: 'UDP',
    bytes: 2048,
  }, // May 23, 2024 00:58:00 UTC
  {
    id: 7,
    sourceIp: '192.168.1.16',
    destinationIp: '10.0.0.1',
    sourcePort: 50007,
    destinationPort: 25,
    timestamp: 1716475200000,
    protocol: 'TCP',
    bytes: 6789,
  }, // May 23, 2024 01:00:00 UTC
  {
    id: 11,
    sourceIp: '192.168.1.10',
    destinationIp: '255.78.3.9',
    sourcePort: 50001,
    destinationPort: 80,
    timestamp: 1716475020000,
    protocol: 'UDP',
    bytes: 5432,
  }, // May 23, 2024 00:57:00 UTC
  {
    id: 21,
    sourceIp: '192.168.1.11',
    destinationIp: '255.78.3.9',
    sourcePort: 50002,
    destinationPort: 443,
    timestamp: 1716475050000,
    protocol: 'TCP',
    bytes: 1500,
  }, // May 23, 2024 00:57:30 UTC
  {
    id: 2,
    sourceIp: '192.168.1.11',
    destinationIp: '10.0.0.1',
    sourcePort: 50002,
    destinationPort: 443,
    timestamp: 1716475050000,
    protocol: 'TCP',
    bytes: 5678,
  }, // May 23, 2024 00:57:30 UTC
  {
    id: 71,
    sourceIp: '192.168.1.16',
    destinationIp: '255.78.3.9',
    sourcePort: 50007,
    destinationPort: 25,
    timestamp: 1716475200000,
    protocol: 'UDP',
    bytes: 2000,
  }, // May 23, 2024 01:00:00 UTC
  {
    id: 61,
    sourceIp: '192.168.1.15',
    destinationIp: '255.78.3.9',
    sourcePort: 50006,
    destinationPort: 53,
    timestamp: 1716475170000,
    protocol: 'TCP',
    bytes: 8192,
  }, // May 23, 2024 00:59:30 UTC
  {
    id: 6,
    sourceIp: '192.168.1.15',
    destinationIp: '10.0.0.1',
    sourcePort: 50006,
    destinationPort: 53,
    timestamp: 1716475170000,
    protocol: 'UDP',
    bytes: 12345,
  }, // May 23, 2024 00:59:30 UTC
];

const report = traffic.reduce(
  (acc, item) => {
    const destinationIp = item.destinationIp;

    // Этот destinationIp уже обрабатывали
    if (destinationIp in acc) {
      return acc;
    }

    // Здесь используем reduce, чтобы за один проход сделать map + filter
    const trafficForIp = traffic.reduce(
      (acc, item) => {
        if (item.destinationIp !== destinationIp) {
          return acc;
        }

        acc.push({
          timestamp: dayjs(item.timestamp).startOf('minute').toISOString(),
          bytes: item.bytes,
        });

        return acc;
      },
      [] as { timestamp: string; bytes: number }[],
    );

    const processedTimestamps: string[] = [];
    const trafficGroupedByTimestamp = trafficForIp.reduce(
      (acc, item) => {
        const timestamp = item.timestamp;

        // Этот timestamp уже обрабатывали
        if (processedTimestamps.includes(timestamp)) {
          return acc;
        }

        const sumForThisTimestamp = trafficForIp.reduce((acc, item) => {
          if (item.timestamp !== timestamp) {
            return acc;
          }

          return acc + item.bytes;
        }, 0);

        // Добавляем этот timestamp в список обработанных
        processedTimestamps.push(timestamp);

        acc.push({
          timestamp,
          bytes: sumForThisTimestamp,
        });

        return acc;
      },
      [] as { timestamp: string; bytes: number }[],
    );

    acc[destinationIp] = trafficGroupedByTimestamp.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

    return acc;
  },
  {} as Record<string, { timestamp: string; bytes: number }[]>,
);

console.log(report);
/*
Ожидаемый вывод:

{
  '10.0.0.1': [
    { timestamp: '2024-05-23T14:37:00.000Z', bytes: 6912 },
    { timestamp: '2024-05-23T14:38:00.000Z', bytes: 12468 },
    { timestamp: '2024-05-23T14:39:00.000Z', bytes: 20235 },
    { timestamp: '2024-05-23T14:40:00.000Z', bytes: 6789 }
  ],
  '255.78.3.9': [
    { timestamp: '2024-05-23T14:37:00.000Z', bytes: 6932 },
    { timestamp: '2024-05-23T14:38:00.000Z', bytes: 3072 },
    { timestamp: '2024-05-23T14:39:00.000Z', bytes: 12288 },
    { timestamp: '2024-05-23T14:40:00.000Z', bytes: 2000 }
  ]
}
 */
