import { ImmutableObject } from '@hookstate/core';
import { Box, MenuItem, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';

import { MyCompTextField } from './text-field';

type Props = {
  onChangeHeight: (inputVal: string) => void;
  onChangeWeight: (inputVal: string) => void;
  onChangeLength: (inputVal: string) => void;
  onChangeWidth: (inputVal: string) => void;
  onChangeCost: (inputVal: string) => void;
  onChangeWhere: (inputVal: string) => void;
  onChangeFromWhere: (inputVal: string) => void;
  onChangeForm: () => void;
  buttonEl: any;
  errors: ImmutableObject<{
    errWidth: string;
    errHeight: string;
    errWeight: string;
    errLength: string;
    errCost: string;
    errPlaceTo: string;
    errFrom: string;
  }>;
};

type LocErrors = {
  errPlaceTo: string;
  errFrom: string;
};

type ParamErrors = {
  errWidth: string;
  errHeight: string;
  errWeight: string;
  errLength: string;
  errCost: string;
};

export const FormChooseSup: React.FC<Props> = ({
  onChangeHeight,
  onChangeWeight,
  onChangeLength,
  onChangeWidth,
  onChangeCost,
  onChangeWhere,
  onChangeFromWhere,
  onChangeForm,
  buttonEl,
  errors,
}) => {
  const options = [
    { value: 'personal', label: 'personal' },
    { value: 'depo', label: 'depo' },
  ];

  const LocationPart = (error: LocErrors) => {
    return (
      <div>
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '20px',
          }}
        >
          Location
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {error.errFrom === '' ? (
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="From where"
                placeholder="depo/personal"
                required
                helperText="Please select option how to want from us retrieve our package"
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
              >
                {options.map((option: { value: string; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          ) : (
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="From where"
                placeholder="depo/personal"
                required
                error
                helperText="Please select option how to want from us retrieve our package"
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
              >
                {options.map((option: { value: string; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}
          <div>
            {error.errPlaceTo === '' ? (
              <div>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="From where"
                  placeholder="depo/personal"
                  required
                  helperText="Please select option how to want from us retrieve our package"
                  onChange={(selectedOption) =>
                    onChangeWhere(selectedOption.target.value)
                  }
                >
                  {options.map((option: { value: string; label: string }) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            ) : (
              <div>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="From where"
                  placeholder="depo/personal"
                  required
                  error
                  helperText="Please select option how to want from us retrieve our package"
                  onChange={(selectedOption) =>
                    onChangeWhere(selectedOption.target.value)
                  }
                >
                  {options.map((option: { value: string; label: string }) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ParamsPart = (error: ParamErrors) => {
    const idComponent = 'outlined-start-adornment';

    const labelHeight = { err: 'Error', withoutErr: 'Height' };
    const labelWeigth = { err: 'Error', withoutErr: 'Weight' };
    const labelLength = { err: 'Error', withoutErr: 'Length' };
    const labelWidth = { err: 'Error', withoutErr: 'Width' };
    const labelCost = { err: 'Error', withoutErr: 'Cost' };

    return (
      <div onChange={onChangeForm}>
        <h1 style={{ textAlign: 'center', paddingBottom: '30px' }}>
          Parameters
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelHeight}
              placeholderComp="Cm"
              errorComp={error.errHeight}
              funcComp={onChangeHeight}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelWeigth}
              placeholderComp="Kg"
              errorComp={error.errWeight}
              funcComp={onChangeWeight}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelLength}
              placeholderComp="Cm"
              errorComp={error.errLength}
              funcComp={onChangeLength}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelWidth}
              placeholderComp="Cm"
              errorComp={error.errWidth}
              funcComp={onChangeWidth}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelCost}
              placeholderComp="Kč"
              errorComp={error.errCost}
              funcComp={onChangeCost}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Card style={{ border: '5px solid #F565AD', borderRadius: '10px' }}>
        <CardContent>
          <div onChange={onChangeForm}>
            {ParamsPart({
              errWidth: errors.errWidth,
              errHeight: errors.errHeight,
              errWeight: errors.errWeight,
              errLength: errors.errLength,
              errCost: errors.errCost,
            })}
          </div>
        </CardContent>
      </Card>
      <Card
        style={{
          border: '5px solid #F565AD',
          borderRadius: '10px',
        }}
      >
        <CardContent>
          {LocationPart({
            errPlaceTo: errors.errPlaceTo,
            errFrom: errors.errFrom,
          })}
        </CardContent>
      </Card>

      {buttonEl}
    </Box>
  );
};
