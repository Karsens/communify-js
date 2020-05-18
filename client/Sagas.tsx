import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import Api from "./Api";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchMe(action) {
  try {
    const me = yield call(Api.fetchMe, action.payload);

    yield put({ type: "ME_FETCH_SUCCEEDED", me });
  } catch (e) {
    yield put({ type: "ME_FETCH_FAILED", message: e.message });
  }
}

function* fetchTribe(action) {
  try {
    const tribe = yield call(Api.fetchTribe, action.payload);

    yield put({ type: "TRIBE_FETCH_SUCCEEDED", tribe });
  } catch (e) {
    yield put({ type: "TRIBE_FETCH_FAILED", message: e.message });
  }
}

function* fetchFranchise(action) {
  try {
    const franchise = yield call(Api.fetchFranchise, action.payload);
    yield put({ type: "FRANCHISE_FETCH_SUCCEEDED", franchise });
  } catch (e) {
    yield put({ type: "FRANCHISE_FETCH_FAILED", message: e.message });
  }
}

function* mySaga() {
  yield takeLatest("ME_FETCH_REQUESTED", fetchMe);
  yield takeLatest("TRIBE_FETCH_REQUESTED", fetchTribe);
  yield takeLatest("FRANCHISE_FETCH_REQUESTED", fetchFranchise);
}

export default mySaga;
