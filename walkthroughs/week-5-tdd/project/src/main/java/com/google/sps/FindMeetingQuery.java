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

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    throw new UnsupportedOperationException("TODO: Implement this method.");
  }

  private boolean areAttendeesInEvent(Event event, Collection<String> attendees) {
    return Collections.disjoint(event.getAttendees(), attendees);
  }

  private List<TimeRange> mergeOverlappingTimeRanges(List<TimeRange> timeRanges) {
    ArrayList<TimeRange> mergedTimeRanges = new ArrayList<>();

    for (TimeRange timeRange : timeRanges) {
      if (mergedTimeRanges.size() == 0) {
        mergedTimeRanges.add(timeRange);
        continue;
      } 

      int lastIndex = mergedTimeRanges.size() - 1;
      TimeRange lastTimeRange = mergedTimeRanges.get(lastIndex);
      
      if (lastTimeRange.contains(timeRange)) {
        continue;
      } else if (lastTimeRange.overlaps(timeRange)) {
        mergedTimeRanges.set(lastIndex, TimeRange.fromStartEnd(lastTimeRange.start(), timeRange.end(), false));
      } else {
        mergedTimeRanges.add(timeRange);
      }
    }

    return mergedTimeRanges;
  }

  private List<TimeRange> findAvailableTimeRanges(List<TimeRange> unavailableTimeRanges, long eventDuration) {
    List<TimeRange> availableTimeRanges = new ArrayList<>();

    int start = TimeRange.START_OF_DAY;

    for (TimeRange timeRange : unavailableTimeRanges) {
      int end = timeRange.start();

      if (end - start >= eventDuration) {
        availableTimeRanges.add(TimeRange.fromStartEnd(start, end, false));
      }

      start = timeRange.end();
    }

    if (TimeRange.END_OF_DAY - start >= eventDuration) {
      availableTimeRanges.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }

    return availableTimeRanges;
  }
}
