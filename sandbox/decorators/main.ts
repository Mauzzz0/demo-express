import dayjs from 'dayjs';

/**
 * Движок для работы с погодой
 */
class WeatherEngine {
  /**
   * Функция для получения прогноза погоды
   */
  @Log()
  getForecast() {
    /**
     * td Это потом в кеширование добавить
     * Пустой цикл для эмуляции какой-то длительной работы.
     * На моём компьютере 1e9 итераций занимает ≈400мсек
     * factor - на сколько умножить эту работу, от 0.1 до 3.1
     * Значит конкретно у меня на компьютере цикл займёт от 40 мсек до 1300 мсек
     */
    const factor = 0.1 + Math.random() * 3;
    for (let i = 0; i < 1e9 * factor; i++) {}

    const temp = -50 + Math.round(Math.random() * 100);
    const humidity = Math.round(Math.random() * 100);

    return { temp, humidity };
  }
}

function Log() {
  return (target: object, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value; // Сохранили оригинальную функцию

    descriptor.value = function (...args: any[]) {
      // Перезаписали оригинальную функцию на свою
      const start = dayjs(); // Запомним время вызова функции

      const result = originalMethod?.apply(this, args); // Вызвали оригинальную функцию и дождались ответа
      // В result будет тот результат, который вернула оригинальная функция

      const end = dayjs(); // Запомним время окончания функции

      console.log({
        // Залогировали данные, имя класса, метода, время вызова, время окончания, длительность и результат
        class: target.constructor.name,
        method: methodName,
        start: start.toISOString(),
        end: end.toISOString(),
        durationMs: end.diff(start, 'ms'),
        result,
      });

      return result; // Вернули тот результат, который вернула оригинальная функция
    };
  };
}

const main = () => {
  const weather = new WeatherEngine();

  const forecast1 = weather.getForecast();
  console.log('Прогноз 1:', forecast1);

  console.log();

  const forecast2 = weather.getForecast();
  console.log('Прогноз 2:', forecast2);
};

main();
