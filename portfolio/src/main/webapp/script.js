// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const RESUME = {
  contactData: {
    'Websites': [
      { text: 'linkedin.com/in/proyectoramirez', link: 'https://linkedin.com/in/proyectoramirez' },
      { text: 'github.com/proyectoramirez', link: 'https://github.com/proyectoramirez' },
    ],
    'Phone': '+1 813-963-1159',
    'Email': 'proyectoramirez07@gmail.com'
  },
  sections: {
    'Education': [
      {
        organization: 'University of South Florida',
        start: 'August 2018',
        end: 'May 2022',
        title: 'Bachelor of Science in Computer Science',
        subtitle: 'GPA: 3.67',
        location: 'Tampa, FL, USA'
      }
    ],
    'Work Experience': [
      {
        organization: 'Google',
        start: 'May 2020',
        title: 'Step Intern',
        location: 'Remote'
      },
      {
        organization: 'Intel Corporation',
        start: 'February 2020',
        end: 'May 2020',
        title: 'Software Engineering Intern',
        location: 'Hillsboro, Oregon',
        description: [
          'Researched and documented an initiative to streamline and automate the computer system design process',
          'Participated in technical meetings with key stakeholders to determine strategic architecture implementation details',
          'Developed an internal TypeScript-based library to serialize objects with important design information into a new format',
          'Prototype a hybrid web application to be distributed to different teams and computer vendors, showcasing the functionality of the serialization library'
        ]
      },
      {
        organization: 'USF Judy Genshaft Honors College IT Department',
        start: 'January 2019',
        end: 'January 2020',
        title: 'Full-stack Web Developer',
        subtitle: 'ASP.NET C#, MSSQL, Entity Framework, Bootstrap, JavaScript',
        location: 'Tampa, FL, USA',
        description: [
          'Automate academic and administrative processes in the College by working with faculty to develop solutions in an internal web application. Some examples are student form submission and processing, student advising, and graduation ceremony organization',
          'Use Google Dialogflow to assist in the creation of a virtual assistant for the College to process common advising requests by students',
          'Lead team in initial phase of codebase modernization, using React.JS, and redesign database structure'
        ]
      }
    ],
    'Activities': [
      {
        organization: 'Society of Hispanic Professional Engineers USF Chapter',
        start: 'May 2020',
        title: 'Vice-president of External Affairs',
        location: 'Tampa, FL, USA'
      },
      {
        organization: 'FIRST Global',
        start: 'June 2019',
        title: 'Team Venezuela Mentor',
        location: 'Remote',
        description: [
          'Lead team marketing and external communications with the FIRST Global organization, sponsors, and the community, through the handling of emails, creation and frequent publication content on social media, official team video editing, uniform design, schedule organization, record keeping, etc.'
        ]
      },
      {
        organization: 'Carrollwood Day School',
        start: 'August 2019',
        end: 'January 2020',
        title: 'FTC Team Nova #11343 Mentor',
        location: 'Tampa, FL, USA',
        description: [
          'Assist in the academic preparation of a team of 5-7 students, as well as the building and programming of robot for season competitions'
        ]
      },
    ]
  }
}

/**
 * Processes and appends the given contact information on the website header.
 * 
 * @param {!Object} contactData Dictionary containing the contact data to be shown. 
 *    Its keys contain the name of each contact section, and its values are
 *    either a single or an array of contact data.
 */
function renderContactData(contactData) {
  const contactsContainer = document.querySelector('header > .contact-container');
  const entries = Object.entries(contactData).map(
    ([title, data]) => buildContactEntryFragment(title, data)
  );

  contactsContainer.append(...entries);
}

/**
 * Creates and populates a contact-entry fragment
 * 
 * @param {string} title The title of the current contact-entry.
 * @param {!(string | {text: string, link: string} | Array<string | {text: string, link: string}>)} data 
 *    A single or an array of contact data, which could be a string or an object with text and a link.
 * 
 * @return {!HTMLElement} A populated contact-entry fragment
 */
function buildContactEntryFragment(title, data) {
  const fragment = createContactEntryFragment();
  const populatedFragment = populateContactEntryFragment(fragment, title, data);

  return populatedFragment;
}

/**
 * @return {!HTMLElement} An empty contact-entry fragment
 */
function createContactEntryFragment() {
  const fragment = document.createElement("div");
  fragment.classList.add("entry");

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title");

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("content");

  fragment.append(titleContainer, contentContainer);

  return fragment;
}

/**
 * Populates an empty "contact-entry" html node given the contact data. 
 * 
 * @param {!DocumentFragment} entryFragment The empty contact-entry html node.
 * @param {string} title The title of the current contact-entry.
 * @param {!(string | {text: string, link: string} | Array<string | {text: string, link: string}>)} data 
 *    A single or an array of contact data, which could be a string or an object with text and a link.
 * 
 * @return {!DocumentFragment} The populated contact entry fragment.
 */
function populateContactEntryFragment(entryFragment, title, data) {
  entryFragment.querySelector('.title').append(title);

  if (Array.isArray(data)) {
    valueDivs = data.map(buildContactEntryContent);
    entryFragment.querySelector('.content').append(...valueDivs);
  } else {
    const div = buildContactEntryContent(data);
    entryFragment.querySelector('.content').append(div);
  }

  return entryFragment;
}

/**
 * Creates either a div or an anchor element,
 * based on the provided data.
 * 
 * @param {!(string | {text: string, link: string})} data 
 *    Contact information to be used in the created element
 * 
 * @return {!HTMLElement} The element containing contact information
 */
function buildContactEntryContent(data) {
  const node = document.createElement('div');

  if (typeof data === 'object') {
    const { text, link } = data;

    const a = document.createElement('a');
    a.href = link;
    a.append(text);

    node.append(a);
  } else {
    node.append(data);
  }

  return node;
}

/**
 * Processes and appends the given experience section information on the website body.
 * 
 * @param {!Object} sectionData Dictionary containing the experience data to be shown. 
 *    Its keys contain the name of each experience section, and its values are
 *    an array of objects describing individual experiences.
 */
function renderSectionData(sectionData) {
  const sectionContainer = document.querySelector('main');
  const sections = Object.entries(sectionData).map(
    ([title, entryData]) => buildSectionFragment(title, entryData)
  );

  sectionContainer.append(...sections);
}

/**
 * Creates and populates a section fragment.
 * 
 * @param {string} title The title of the current section.
 * @param {!Array<object>} entryData An array of objects describing individual experiences
 *    in each section.
 * 
 * @return {!DocumentFragment} The populated section fragment.
 */
function buildSectionFragment(title, entryData) {
  const fragment = document.querySelector('#section').content.cloneNode(/* deep */ true);
  const populatedFragment = populateSectionFragment(fragment, title, entryData);

  return populatedFragment;
}

/**
 * Populates an empty section fragment. 
 * 
 * @param {!DocumentFragment} section The empty section fragment.
 * @param {string} title The title of the current section.
 * @param {!Array<object>} entryData An array of objects describing individual experiences
 *    in each section.
 * 
 * @return {!DocumentFragment} The populated section.
 */
function populateSectionFragment(fragment, title, entryData) {
  const entries = createSectionEntries(entryData);

  fragment.querySelector('.title').append(title);
  fragment.querySelector('section').append(...entries);

  return fragment;
}

/**
 * Converts each element in the experience entry data to
 * an html node based on the "section-entry template"
 * 
 * @param {!Array} entryData An array of objects describing individual experiences
 *    in each section.
 * 
 * @return {!Array} The array of "section-entry" html nodes
 */
function createSectionEntries(entryData) {
  const sectionEntryTemplate = document.querySelector('#section-entry');
  const entries = entryData.map(data => loadSectionEntry(sectionEntryTemplate.content.cloneNode(/* deep */ true), data));

  return entries;
}

/**
 * Populates an empty "section-entry" html node given the entry data. 
 * 
 * @param {!DocumentFragment} entry The empty section-entry html node.
 * @param {!Object} data An object describing a specific experience.
 * 
 * @return {!DocumentFragment} The populated section-entry.
 */
function loadSectionEntry(entry, data) {
  entry.querySelector('.organization').append(data.organization);
  entry.querySelector('.dates').append(
    data.end ?
      `${data.start} - ${data.end}` :
      data.start
  );
  entry.querySelector('.title').append(data.title);
  entry.querySelector('.location').append(data.location);
  data.subtitle && entry.querySelector('.subtitle').append(`(${data.subtitle})`);
  data.description && entry.querySelector('.description').append(
    createSectionEntryDescription(data.description)
  );

  return entry;
}
/**
 * Converts description data to an ul html
 * element if it is an array. Otherwise, returns a string.
 * 
 * @param {!(string | Array<string>)} description A string or a list of strings
 *    describing an experience.
 * 
 * @return {string | !HTMLElement}
 */
function createSectionEntryDescription(description) {
  if (Array.isArray(description)) {
    const list = document.createElement('ul');
    const elements = description.map(e => {
      const element = document.createElement('li');
      element.append(e);
      return element;
    })

    list.append(...elements)

    return list;
  } else {
    return description;
  }
}

/**
 * Called after the HTML body has been loaded.
 */
function main() {
  renderContactData(RESUME.contactData);
  renderSectionData(RESUME.sections);
}

document.addEventListener('DOMContentLoaded', main);
