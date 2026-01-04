import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface AccuracyRateQueryDto {
  file_num: number;
  startDate?: Date;
  endDate?: Date;
  format_id?: { [key: string]: boolean };
}

@Injectable()
export class AccuracyRateQueryPipe implements PipeTransform {
  transform(value: any): AccuracyRateQueryDto {
    const { file_num, startDate, endDate, format_id } = value;

    // file_numの検証と変換（必須）
    if (!file_num) {
      throw new BadRequestException('file_num is required');
    }
    const fileNum = parseInt(file_num, 10);
    if (isNaN(fileNum)) {
      throw new BadRequestException('file_num must be a valid number');
    }

    // startDateの検証と変換（オプショナル）
    let startDateObj: Date | undefined;
    if (startDate) {
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        throw new BadRequestException(
          'startDate must be a valid date in yyyy-mm-dd format',
        );
      }
    }

    // endDateの検証と変換（オプショナル）
    let endDateObj: Date | undefined;
    if (endDate) {
      endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        throw new BadRequestException(
          'endDate must be a valid date in yyyy-mm-dd format',
        );
      }
    }

    // 両方の日付が提供されている場合のみ、日付の妥当性チェック
    if (startDateObj && endDateObj && startDateObj > endDateObj) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate',
      );
    }

    // format_idの検証と変換（オプショナル）
    let formatIdObj: AccuracyRateQueryDto['format_id'];
    if (format_id) {
      if (typeof format_id === 'string') {
        const ids = format_id
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id !== '');
        const invalidId = ids.find((id: string) => isNaN(parseInt(id, 10)));
        if (invalidId) {
          throw new BadRequestException(
            `format_id must contain valid numbers (invalid: ${invalidId})`,
          );
        }
        if (ids.length > 0) {
          formatIdObj = ids.reduce((acc, cur) => ({ ...acc, [cur]: true }), {});
        }
      } else if (typeof format_id === 'object') {
        const entries = Object.entries(format_id).filter(
          ([, enabled]) => !!enabled,
        );
        const invalidId = entries.find(([key]) => isNaN(parseInt(key, 10)));
        if (invalidId) {
          throw new BadRequestException(
            `format_id must contain valid numbers (invalid: ${invalidId[0]})`,
          );
        }
        if (entries.length > 0) {
          formatIdObj = entries.reduce(
            (acc, [key]) => ({ ...acc, [key]: true }),
            {},
          );
        }
      } else {
        throw new BadRequestException(
          'format_id must be provided as a comma separated string',
        );
      }
    }

    return {
      file_num: fileNum,
      startDate: startDateObj,
      endDate: endDateObj,
      format_id: formatIdObj,
    };
  }
}
