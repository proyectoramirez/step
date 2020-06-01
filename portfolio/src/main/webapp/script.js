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
    "Websites": [
      { text: "linkedin.com/in/proyectoramirez", link: "https://linkedin.com/in/proyectoramirez" },
      { text: "github.com/proyectoramirez", link: "https://github.com/proyectoramirez" },
    ],
    "Phone": "+1 813-963-1159",
    "Email": "proyectoramirez07@gmail.com"
  },
  sections: {
    "Education": [
      {
        organization: "University of South Florida",
        start: "August 2018",
        end: "May 2022",
        title: "Bachelor of Science in Computer Science",
        subtitle: "GPA: 3.67",
        location: "Tampa, FL, USA"
      }
    ],
    "Work Experience": [
      {
        organization: "Google",
        start: "May 2020",
        title: "Step Intern",
        location: "Remote"
      },
      {
        organization: "Intel Corporation",
        start: "February 2020",
        end: "May 2020",
        title: "Software Engineering Intern",
        location: "Hillsboro, Oregon",
        description: [
          "Researched and documented an initiative to streamline and automate the computer system design process",
          "Participated in technical meetings with key stakeholders to determine strategic architecture implementation details",
          "Developed an internal TypeScript-based library to serialize objects with important design information into a new format",
          "Prototype a hybrid web application to be distributed to different teams and computer vendors, showcasing the functionality of the serialization library"
        ]
      },
      {
        organization: "USF Judy Genshaft Honors College IT Department",
        start: "January 2019",
        end: "January 2020",
        title: "Full-stack Web Developer",
        subtitle: "ASP.NET C#, MSSQL, Entity Framework, Bootstrap, JavaScript",
        location: "Tampa, FL, USA",
        description: [
          "Automate academic and administrative processes in the College by working with faculty to develop solutions in an internal web application. Some examples are student form submission and processing, student advising, and graduation ceremony organization",
          "Use Google Dialogflow to assist in the creation of a virtual assistant for the College to process common advising requests by students",
          "Lead team in initial phase of codebase modernization, using React.JS, and redesign database structure"
        ]
      }
    ],
    "Activities": [
      {
        organization: "Society of Hispanic Professional Engineers USF Chapter",
        start: "May 2020",
        title: "Vice-president of External Affairs",
        location: "Tampa, FL, USA"
      },
      {
        organization: "FIRST Global",
        start: "June 2019",
        title: "Team Venezuela Mentor",
        location: "Remote",
        description: [
          "Lead team marketing and external communications with the FIRST Global organization, sponsors, and the community, through the handling of emails, creation and frequent publication content on social media, official team video editing, uniform design, schedule organization, record keeping, etc."
        ]
      },
      {
        organization: "Carrollwood Day School",
        start: "August 2019",
        end: "January 2020",
        title: "FTC Team Nova #11343 Mentor",
        location: "Tampa, FL, USA",
        description: [
          "Assist in the academic preparation of a team of 5-7 students, as well as the building and programming of robot for season competitions"
        ]
      },
    ]
  }
}

function loadContactData(contactData) {
  const contactsContainer = document.querySelector("header > .contact-container");
  const entries = createContactEntries(contactData);

  contactsContainer.append(...entries);
}

function createContactEntries(contactData) {
  const contactEntryTemplate = document.querySelector("#contact-entry");
  const entries = Object.entries(contactData).map(
    ([title, data]) => loadContactEntry(contactEntryTemplate, title, data)
  );

  return entries;
}

function loadContactEntry(template, title, data) {
  const entry = template.content.cloneNode(true);
  entry.querySelector(".title").append(title);

  if (Array.isArray(data)) {
    valueDivs = data.map(createContactEntryContent);
    entry.querySelector(".content").append(...valueDivs);
  } else {
    const div = createContactEntryContent(data);
    entry.querySelector(".content").append(div);
  }

  return entry;
}

function createContactEntryContent(data) {
  const node = document.createElement("div");;

  if (typeof data === "object") {
    const { text, link } = data;

    const a = document.createElement("a");
    a.href = link;
    a.append(text);

    node.append(a);
  } else {
    node.append(data);
  }

  return node;
}

function loadSectionData(sectionData) {
  const sectionContainer = document.querySelector("main");
  const sections = createSections(sectionData);

  sectionContainer.append(...sections);
}

function createSections(sectionData) {
  const sectionTemplate = document.querySelector("#section");
  const sections = Object.entries(sectionData).map(
    ([title, entryData]) => loadSection(sectionTemplate, title, entryData)
  );

  return sections;
}

function loadSection(template, title, entryData) {
  const section = template.content.cloneNode(true);
  const entries = createSectionEntries(entryData);

  section.querySelector(".title").append(title);
  section.append(...entries);

  return section;
}

function createSectionEntries(entryData) {
  const sectionEntryTemplate = document.querySelector("#section-entry");
  const entries = entryData.map(data => loadSectionEntry(sectionEntryTemplate, data));

  return entries;
}

function loadSectionEntry(template, data) {
  const entry = template.content.cloneNode(true);

  entry.querySelector(".organization").append(data.organization);
  entry.querySelector(".dates").append(`${data.start} - ${data.end}`);
  entry.querySelector(".title").append(data.title);
  entry.querySelector(".subtitle").append(data.subtitle);
  entry.querySelector(".location").append(data.location);
  data.subtitle && entry.querySelector(".subtitle").append(`(${data.subtitle})`);
  data.description && entry.querySelector(".description").append(
    createSectionEntryDescription(data.description)
  );

  return entry;
}

function createSectionEntryDescription(description) {
  if (Array.isArray(description)) {
    const list = document.createElement("ul");
    const elements = description.map(e => {
      const element = document.createElement("li");
      element.append(e);
      return element;
    })

    list.append(...elements)

    return list;
  } else {
    return description;
  }
}
function main() {
  loadContactData(RESUME.contactData);
  loadSectionData(RESUME.sections)
}

document.addEventListener("DOMContentLoaded", main);