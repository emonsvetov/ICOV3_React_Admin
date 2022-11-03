import {inArray} from '@/shared/helpers';
import React, {useEffect, useState, useRef} from "react";
import classNames from "classnames";
import {indexOfAll} from '@/shared/helpers'

export const CheckboxHierarchy = ({name, fields, setFields, options, isRoot, isChildren, label, attr}) => {

  const [instanceKey, setInstanceKey] = useState(0)
  const handleReset = () => setInstanceKey(i => i + 1)

  const [isVisible, setIsVisible] = useState(false);
  const expand = () => {
    setIsVisible(!isVisible);
  };
  const close = () => {
    setIsVisible(false);
  }

  function useOutside(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          close();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutside(wrapperRef);

  const findChildrenOptionId = (options, subOptions) => {
    for (let object of options) {
      subOptions.push(object[attr]);
      if (object.children && object.children.length) {
        return findChildrenOptionId(object.children, subOptions)
      }
    }
    return subOptions;
  }

  const toggleAll = (event, options) => {
    let tmpFields = fields;
    let subOptions = [];
    for (let option of options) {
      if (option.children && option.children.length) {
        subOptions = findChildrenOptionId(option.children, subOptions);
      }

      if (event.target.checked) {
        if(tmpFields.indexOf(option[attr]) === -1){
          tmpFields.push(option[attr]);
        }
        subOptions.map(item => {
          if(tmpFields.indexOf(item) === -1) {
            tmpFields.push(item);
          }
        });
      } else {
        const index = tmpFields.indexOf(option[attr])
        if (tmpFields && index !== -1) {
          tmpFields.splice(index, 1);
        }
        subOptions.map(item => {
          let indexAll = indexOfAll(tmpFields, item);
          if (indexAll.length > 0) {
            indexAll.slice().reverse()
              .forEach(function (subItem) {
                tmpFields.splice(subItem, 1);
              });
          }
        });
      }
      setFields(tmpFields);
    }
  }

  const toggle = (event, option) => {
    let tmpFields = fields;
    let subOptions = [];
    if (option.children && option.children.length) {
      subOptions = findChildrenOptionId(option.children, subOptions);
    }

    if (event.target.checked) {
      if(tmpFields.indexOf(option[attr]) === -1) {
        tmpFields.push(option[attr]);
      }
      subOptions.map(item => {
        if(tmpFields.indexOf(item) === -1) {
          tmpFields.push(item);
        }
      });
    } else {
      const index = tmpFields.indexOf(option[attr])
      if (tmpFields && index !== -1) {
        tmpFields.splice(index, 1);
      }
      subOptions.map(item => {
        let indexAll = indexOfAll(tmpFields, item);
        if (indexAll.length > 0) {
          indexAll.slice().reverse()
            .forEach(function (subItem) {
              tmpFields.splice(subItem, 1);
            });
        }
      });
    }
    setFields(tmpFields);
  };

  const categoryClass = classNames({
    'checkbox-hierarchy': !isChildren,
    'children-checkbox-hierarchy': !!isChildren,
    'hierarchy_visible': isVisible,
    'checkbox-hierarchy-wrap': isRoot,
  });

  return (
    <>
      {isRoot ? (
        <div className={categoryClass} ref={wrapperRef}>
          <span className="lnr lnr-chevron-right" onClick={expand} onBlur={close}/> <span onClick={expand} style={{cursor: 'pointer'}}
          className="form__form-group-label">{label}</span>
          <div className='array-wrap'>

            <div style={{marginLeft: -6}}><label className="checkbox-btn ">
              <input className="checkbox-btn__checkbox" type="checkbox" onClick={handleReset}
                     onChange={event => toggleAll(event, options)}/>
              <span className="checkbox-btn__checkbox-custom">
                            <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z">
                              </path>
                            </svg>
                        </span>
              <span className="checkbox-btn__label">Select All</span>
            </label></div>

            {isVisible &&
              options.map(option => (
                <CheckboxHierarchy key={'id-' + option[attr]} name={name} fields={fields} setFields={setFields}
                                   toggle={toggle} options={[option]} attr={attr}/>
              ))
            }
          </div>
        </div>
      ) : (
        options.map(option => (
          <div className={categoryClass} key={`checkbox-${option[attr]}`}>
            <div className="form__form-group-input-wrap" style={{whiteSpace: 'nowrap'}}>
              {option.children.length > 0 ? (
                <span className="lnr lnr-chevron-right" onClick={expand}/>
              ) : (
                <span className="lnr"/>
              )}
              <label className="checkbox-btn ">
                <input className="checkbox-btn__checkbox" name={name} type="checkbox" onClick={handleReset}
                       onChange={event => toggle(event, option)}
                       checked={inArray(option[attr], fields)}/>
                <span className="checkbox-btn__checkbox-custom">
                            <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z">
                              </path>
                            </svg>
                        </span>
                <span className="checkbox-btn__label">{option.name}</span>
              </label>
              {isVisible &&
                <CheckboxHierarchy key={instanceKey} name={name} fields={fields} setFields={setFields}
                                   options={option.children} isChildren={true} attr={attr} />
              }
            </div>
          </div>
        ))
      )
      }
    </>
  )
}

export default CheckboxHierarchy;